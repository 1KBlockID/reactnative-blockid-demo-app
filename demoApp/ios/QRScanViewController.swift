//
//  QRScanViewController.swift
//  demoApp
//
//  Created by Kajal Verma on 18/07/23.
//

import Foundation
import AVFoundation
import BlockID
import Toast_Swift

public enum QROptions {
  case withScopeData
  case withPresetData
}

class QRScanViewController: UIViewController {
  @IBOutlet weak var btnQr1: UIButton!
  @IBOutlet weak var btnQr2: UIButton!
  @IBOutlet weak var _viewQRScan: BIDScannerView!
  @IBOutlet weak var _qrView: UIView!
  @IBOutlet weak var _viewBtn: UIView!
  
  private var qrOption = QROptions.withScopeData
  private var qrScannerHelper: QRScannerHelper?
  
  @IBAction func qrOptionButtonClicked(_ sender: UIButton) {
    qrOption = (sender.tag == 0) ? QROptions.withScopeData : QROptions.withPresetData
    self.scanQRCode()
  }
  
  override func viewDidLoad() {
    super.viewDidLoad()
    self.scanQRCode();
  }
  
  private func scanQRCode() {
    DispatchQueue.main.async {
      self._qrView.isHidden = false
      self._viewBtn.isHidden = true
      if((self._viewQRScan) != nil){
        self.qrScannerHelper = QRScannerHelper.init(bidScannerView: self._viewQRScan,
                                                    kQRScanResponseDelegate: self)
        self.qrScannerHelper?.startQRScanning()
      }
    }
    
  }
  
  private func goBack() {
    //        self.navigationController?.popViewController(animated: true)
    DispatchQueue.main.async {
      self.dismiss(animated: true, completion: nil);
    }
  }
}
extension QRScanViewController: QRScanResponseDelegate {
  func onQRScanResult(qrCodeData: String?) {
    if qrCodeData == nil {
      
      AVCaptureDevice.requestAccess(for: AVMediaType.video) { response in
        if !response {
          DispatchQueue.main.async {
            //                        self.alertForCameraAccess()
          }
        }
      }
      return
    }
    qrScannerHelper?.stopQRScanning()
    _qrView.isHidden = true
    _viewBtn.isHidden = true
    
    self.processQRData(qrCodeData ?? "")
    
  }
  
  private func processQRData(_ data: String) {
    
    // uwl 2.0
    if data.hasPrefix("https://") && data.contains("/sessions") {
      print("https:// and /sessions condition");
      handleUWL2(data: data)
      return
    }
    
    // uwl 1.0
    //decode the base64 payload data
    guard let decodedData = Data(base64Encoded: data) else {
      self.inValidQRCode()
      return
    }
    
    let decodedString = String(data: decodedData, encoding: .utf8)!
    let qrModel = CommonFunctions.jsonStringToObject(json: decodedString) as AuthenticationPayloadV1?
    
    // 1. Scopes converted to lowercase
    qrModel?.scopes = qrModel?.scopes?.lowercased()
    
    // 2. If scopes has "windows", replace it by "scep_creds"
    qrModel?.scopes = qrModel?.scopes?.replacingOccurrences(of: "windows", with: "scep_creds")
    presentConsentViewWithData(qrdata: qrModel!, response: "")
  }
  
  private func processScope(qrModel: AuthenticationPayloadV1?, response:Any) {
    // 1. Scopes converted to lowercase
    qrModel?.scopes = qrModel?.scopes?.lowercased()
    // 2. If scopes has "windows", replace it by "scep_creds"
    qrModel?.scopes = qrModel?.scopes?.replacingOccurrences(of: "windows", with: "scep_creds")
    if let qrModel = qrModel {
      presentConsentViewWithData(qrdata: qrModel, response: response)
    }
  }
  
  private func handleUWL2(data: String) {
    let arrSplitStrings = data.components(separatedBy: "/session/")
    let url = arrSplitStrings.first ?? ""
    if BlockIDSDK.sharedInstance.isTrustedSessionSources(sessionUrl: url) {
      
      GetSessionData.sharedInstance.getSessionData(url: data) { [self] response, message, isSuccess in
        if isSuccess {
          print("getSessionData isSuccess", isSuccess);
          let authQRUWL2 = CommonFunctions.jsonStringToObject(json: response ?? "") as AuthenticationPayloadV2?
          let authQRUWL1 = authQRUWL2?.getAuthRequestModel(sessionUrl: data)
          processScope(qrModel: authQRUWL1, response : response)
        } else {
          // Show toast
          print("getSessionData error");
          self.view.makeToast(message, duration: 3.0, position: .center, title: "Error", completion: {_ in
            self.goBack()
            return
          })
        }
      }
    } else {
      // Show toast
      print("Suspicious QR Code");
      self.view.makeToast("Suspicious QR Code", duration: 3.0, position: .center, title: "Error", completion: {_ in
        self.goBack()
        return
      })
    }
  }
  
  private func inValidQRCode() {
    self._viewBtn.isHidden = true
    self._qrView.isHidden = true
    self.showAlertView(title: "Invalid Code", message: "Unsupported QR code detected.")
  }
  
  func getAllData<T: Codable>(for model: T) -> [String: Any]? {
      let encoder = JSONEncoder()
      guard let data = try? encoder.encode(model) else {
          return nil
      }
      return try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
  }
  
  private func presentConsentViewWithData(qrdata: AuthenticationPayloadV1, response:Any) {
    self._viewBtn.isHidden = true
    self._qrView.isHidden = true
    self.navigationController?.popViewController(animated: true)
    
    if let sessionData = getAllData(for: qrdata) {
      DispatchQueue.main.async {
        RNEventEmitter.emitter.sendEvent(withName: "OnQRScanResult", body:sessionData)
        self.dismiss(animated: true, completion: nil);
      }
    }
  }
  
  @IBAction func cancelClicked(_ sender: Any) {
    let alert = UIAlertController(title: "Cancellation warning!", message: "Do you want to cancel the QR Login?", preferredStyle: .alert)
    alert.addAction(UIAlertAction(title: "No", style: .default, handler: nil))
    alert.addAction(UIAlertAction(title: "Yes", style: .default, handler: {_ in
      DispatchQueue.main.async {
        self.dismiss(animated: true, completion: nil);
      }
    }))
    self.present(alert, animated: true)
    return
    
  }
}

public struct AuthRequestModel {
  var lat: Double = 0.0
  var lon: Double = 0.0
  var session: String = ""
  var creds: String = ""
  var scopes: String = ""
  var origin: BIDOrigin!
  var isConsentGiven: Bool = false
  var userId: String?
  var sessionUrl: String = ""
}
