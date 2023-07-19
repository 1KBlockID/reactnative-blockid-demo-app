//
//  LiveIDViewController.swift
//  demoApp
//
//  Created by Kajal Verma on 06/07/23.
//

import UIKit
import AVFoundation
import BlockID
import Toast_Swift

struct DetectionMsg {
  static let blink = "Please blink your eyes"
  static let smile = "Please smile"
  static let left = "Please turn left"
  static let right = "Please turn right"
  static let up = "Move your head up"
  static let down = "Move your head down"
}

/*
 
 Adding Feedback Generator
 
 */
enum Vibration {
  case error
  case success
  case warning
  case light
  case medium
  case heavy
  @available(iOS 13.0, *)
  case soft
  @available(iOS 13.0, *)
  case rigid
  case selection
  case oldSchool
  
  public func vibrate() {
    switch self {
    case .error:
      UINotificationFeedbackGenerator().notificationOccurred(.error)
    case .success:
      UINotificationFeedbackGenerator().notificationOccurred(.success)
    case .warning:
      UINotificationFeedbackGenerator().notificationOccurred(.warning)
    case .light:
      UIImpactFeedbackGenerator(style: .light).impactOccurred()
    case .medium:
      UIImpactFeedbackGenerator(style: .medium).impactOccurred()
    case .heavy:
      UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
    case .soft:
      if #available(iOS 13.0, *) {
        UIImpactFeedbackGenerator(style: .soft).impactOccurred()
      }
    case .rigid:
      if #available(iOS 13.0, *) {
        UIImpactFeedbackGenerator(style: .rigid).impactOccurred()
      }
    case .selection:
      UISelectionFeedbackGenerator().selectionChanged()
    case .oldSchool:
      //FIXME: - Need to be fixed
      print("old school----->")
      //AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
    }
  }
}


class LiveIDViewController: UIViewController {
  var isForVerification: Bool = false
  var isForConsent: Bool = false
  
  private var attemptCounts = 0
  
  private var liveIdScannerHelper: LiveIDScannerHelper?
  private let isResettingExpressionsAllowed = false
  private var isLoaderHidden: Bool = false
  var isLivenessNeeded: Bool = false
  private var imgOverlay: UIImageView!
  var onFinishCallback: ((_ status: Bool) -> Void)?
  
  @IBOutlet private weak var _viewBG: UIView!
  @IBOutlet private weak var _viewLiveIDScan: BIDScannerView!
  @IBOutlet private weak var _imgOverlay: UIImageView!
  @IBOutlet private weak var _lblInformation: UILabel!
  @IBOutlet private weak var _lblPageTitle: UILabel!
  
  // MARK: - View Life Cycle -
  override func viewDidLoad() {
    super.viewDidLoad()
    _viewBG.isHidden = true
   // _imgOverlay.isHidden = true
    _lblInformation.isHidden = true
    
    if isLivenessNeeded {
        _lblPageTitle.text = "Enroll Live ID (with Liveness Check)"
    } else {
        _lblPageTitle.text = "Enroll Live ID"
    }
    
    if isForVerification {
        //For LiveID Verification
        _lblPageTitle.text = "Live ID Authentication"
    }
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
        //2. Show Alert
        DispatchQueue.main.async {
          //                    self.alertForCameraAccess()
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
    debugPrint("cancelTapped")
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
      //            msg = "OFFLINE".localizedMessage(CustomErrors.Network.OFFLINE.code)
      //            title = ErrorConfig.noInternet.title
    }
    else if (error != nil && error?.code == CustomErrors.kUnauthorizedAccess.code) {
      //            self.showAppLogin()
    }
    else {
      msg = error!.message
    }
    //        self.view.makeToast(msg, duration: 3.0, position: .center, title: title, completion: {_ in
    //            self.goBack()
    //        })
  }
  
  private func stopLiveIDScanning() {
    self.liveIdScannerHelper?.stopLiveIDScanning()
  }
  
}

// MARK: - LiveIDResponseDelegate -
extension LiveIDViewController: LiveIDResponseDelegate {
  
  func liveIdDidDetectErrorInScanning(error: ErrorResponse?) {
    //Check If licenene key not enabled
    if error?.code == CustomErrors.kSomeProblemWhileFaceFinding.code {
      self._lblInformation.text = "Camera sensor is blocked. Unblock sensor and continue..."
      Vibration.error.vibrate()
    }
  }
  
  func liveIdDetectionCompleted(_ liveIdImage: UIImage?, signatureToken: String?, error: ErrorResponse?) {
    if error?.code == CustomErrors.kScanCancelled.code {
      // Selfie scanner cancelled
      self.goBack()
    }
    else if(error === nil){
      DispatchQueue.main.async {
        self.setLiveID(withPhoto: liveIdImage!, token: signatureToken!);
      }
    }
  }
  
  func readyForExpression(_ livenessFactor: LivenessFactorType) {
    DispatchQueue.main.async {
      self._lblInformation.isHidden = false
      self._lblInformation.text = ""
      Vibration.success.vibrate()
      switch livenessFactor {
      case .BLINK:
        self._lblInformation.text = DetectionMsg.blink
      case .SMILE:
        self._lblInformation.text = DetectionMsg.smile
      case .TURN_LEFT:
        self._lblInformation.text = DetectionMsg.left
      case .TURN_RIGHT:
        self._lblInformation.text = DetectionMsg.right
      case .NONE:
        return
      @unknown default:
        return
      }
      self.imgOverlay.tintColor = .green
    }
    
  }
  
  func faceLivenessCheckStarted() {
    isLoaderHidden = true
    //        self.view.makeToastActivity(.center)
  }
  
  func focusOnFaceChanged(isFocused: Bool?) {
        guard let inFocus = isFocused else {
          return
        }
    
        if !inFocus {
          DispatchQueue.main.async {
            self.imgOverlay.tintColor = .red
            self._lblInformation.text = "Out of focus !!!. Please try again."
            Vibration.oldSchool.vibrate()
          }
        } else {
          DispatchQueue.main.async {
            self.imgOverlay.tintColor = .green
    
          }
        }
  }
  
  func wrongExpressionDetected(_ livenessFactor: LivenessFactorType) {
    var factor = ""
    switch livenessFactor {
    case .BLINK:
      factor = "Blink"
    case .SMILE:
      factor = "Smile"
    case .TURN_LEFT:
      factor = "Turned Left"
    case .TURN_RIGHT:
      factor = "Turned Right"
    case .NONE:
      factor = "Unknown"
      /* case .MOVE_UP:
       factor = "Moved Up"
       case .MOVE_DOWN:
       factor = "Moved Down"*/
    }
    
    DispatchQueue.main.async {
      self.imgOverlay.tintColor = .red
      self._lblInformation.text = "Wrong Expression: \(factor)"
      Vibration.oldSchool.vibrate()
      
    }
  }
}


