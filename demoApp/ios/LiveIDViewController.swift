//  Created by 1Kosmos Engineering
//  demoApp
//
//  Copyright © 2023 1Kosmos. All rights reserved.

import UIKit
import AVFoundation
import BlockID
import Toast_Swift

class LiveIDViewController: UIViewController {
  
  private var liveIdScannerHelper: LiveIDScannerHelper?
  
  @IBOutlet private weak var _viewBG: UIView!
  @IBOutlet private weak var _viewLiveIDScan: BIDScannerView!
  @IBOutlet private weak var _imgOverlay: UIImageView!
  @IBOutlet private weak var _lblInformation: UILabel!
  @IBOutlet private weak var _lblPageTitle: UILabel!
  
  // MARK: - View Life Cycle -
  override func viewDidLoad() {
    super.viewDidLoad()
    _viewBG.isHidden = true
    _lblInformation.isHidden = true
    _lblPageTitle.text = "Enroll Live ID"
    startLiveIDScanning()
  }
  
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
  }
  
  // MARK: - LiveID Scanning -
  private func startLiveIDScanning() {
    //1. Check for Camera Permission
    AVCaptureDevice.requestAccess(for: AVMediaType.video) { response in
      if !response {
        DispatchQueue.main.async {
          self.dismiss(animated: true, completion: nil);
        }
      }
      else {
        DispatchQueue.main.async {
          //3. Initialize LiveIDScannerHelper
          if self.liveIdScannerHelper == nil {
            self.liveIdScannerHelper = LiveIDScannerHelper.init(liveIdResponseDelegate: self)
          }
          //4. Start Scanning
          self.liveIdScannerHelper?.startLiveIDScanning()
        }
      }
    }
  }
  
  private func goBack() {
    DispatchQueue.main.async {
      self.dismiss(animated: true, completion: nil);
    }
  }
  
  @IBAction func cancelTapped(_ sender: Any) {
    let alert = UIAlertController(title: "Cancellation warning!", message: "Do you want to cancel the registration process?", preferredStyle: .alert)
    alert.addAction(UIAlertAction(title: "No", style: .default, handler: nil))
    alert.addAction(UIAlertAction(title: "Yes", style: .default, handler: {_ in
      self.stopLiveIDScanning()
      self.goBack()
    }))
    self.present(alert, animated: true)
    return
  }
  
  private func setLiveID(withPhoto face: UIImage, token: String) {
    self.view.makeToastActivity(.center)
    BlockIDSDK.sharedInstance.setLiveID(liveIdImage: face, liveIdProofedBy: "", sigToken: token) { [self] (status, error) in
      self.view.hideToastActivity()
      if !status {
        DispatchQueue.main.async {
          let alert = UIAlertController(title: "Error", message: error?.message, preferredStyle: .alert)
          alert.addAction(UIAlertAction(title: "OK", style: .default, handler: {_ in
            self.dismiss(animated: true , completion: nil);
          }))
          self.present(alert, animated: true)
        }
        return
      }
      // SUCCESS
      self.stopLiveIDScanning()
      RNEventEmitter.emitter.sendEvent(withName: "OnLiveResult", body:"OK")
      DispatchQueue.main.async {
        let alert = UIAlertController(title: "Success", message:"Live ID enrolled successfully", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: {_ in
          self.dismiss(animated: true , completion: nil);
        }))
        self.present(alert, animated: true)
      }
    }
  }
  
  private func showErrorDialog(_ error: ErrorResponse?) {
    var title: String? = nil
    var msg: String? = nil
    if error?.code == NSURLErrorNotConnectedToInternet ||
        error?.code == CustomErrors.Network.OFFLINE.code {
      msg = "OFFLINE".localizedMessage(CustomErrors.Network.OFFLINE.code)
      title = ErrorConfig.noInternet.title
    }
    else if (error != nil && error?.code == CustomErrors.kUnauthorizedAccess.code) {
      //            self.showAppLogin()
    }
    else {
      msg = error!.message
    }
    self.view.makeToast(msg, duration: 3.0, position: .center, title: title, completion: {_ in
      self.goBack()
    })
  }
  
  private func stopLiveIDScanning() {
    self.liveIdScannerHelper?.stopLiveIDScanning()
  }
}

// MARK: - LiveIDResponseDelegate -
extension LiveIDViewController: LiveIDResponseDelegate {
  
  func liveIdDetectionCompleted(_ liveIdImage: UIImage?, signatureToken: String?, error: ErrorResponse?) {
    if error?.code == CustomErrors.kScanCancelled.code {
      // Selfie scanner cancelled
      self.goBack()
    }
    //     check for error...
    if error?.code == CustomErrors.License.MODULE_NOT_ENABLED.code {
      let localizedMessage = "MODULE_NOT_ENABLED".localizedMessage(CustomErrors.License.MODULE_NOT_ENABLED.code)
      self.view.makeToast(localizedMessage,
                          duration: 3.0,
                          position: .center,
                          title: ErrorConfig.error.title, completion: {_ in
        // go back to previous screen...
        self.goBack()
      })
      return
    }
    else if(error === nil){
      DispatchQueue.main.async {
        self.setLiveID(withPhoto: liveIdImage!, token: signatureToken!);
      }
    }
  }
}
