//
//  ViewControllerExtension.swift
//  demoApp


import UIKit
import BlockID

extension UIViewController {
  
  // Mark: - Fix me -
  public func getDriverLicenseData(docIndex: Int, category: RegisterDocCategory) -> (docId: String?, islivenessNeeded: Bool?) {
    let strDocuments = BIDDocumentProvider.shared.getUserDocument(id: nil,
                                                                  type: RegisterDocType.DL.rawValue,
                                                                  category: category.rawValue) ?? ""
    guard let arrDocuments = CommonFunctions.convertJSONStringToJSONObject(strDocuments) as? [[String : Any]] else {
      return (nil, nil)
    }
    
    let index = (docIndex-1)
    if arrDocuments.count > index{
      let dictDoc = arrDocuments[index]
      return (dictDoc["id"] as? String, dictDoc["isLivenessRequired"] as? Bool)
    }
    return (nil, nil)
  }
  
  public func getDocumentID(docIndex: Int , type: RegisterDocType ,category: RegisterDocCategory) -> String? {
    let strDocuments = BIDDocumentProvider.shared.getUserDocument(id: nil,
                                                                  type: type.rawValue,
                                                                  category: category.rawValue) ?? ""
    guard let arrDocuments = CommonFunctions.convertJSONStringToJSONObject(strDocuments) as? [[String : Any]] else {
      return nil
    }
    
    let index = (docIndex-1)
    if arrDocuments.count > index{
      let dictDoc = arrDocuments[index]
      return dictDoc["id"] as? String
    }
    
    return nil
  }
  
  public func showAlertView(title: String, message: String) {
    let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
    
    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
    
    self.present(alert, animated: true)
    
  }
  
  public func  resetAppNSDK() {
    //If launched using Magic-Link
    //Need to resave magic-link once app is reset
    UserDefaults.removeAllValues()
    BlockIDSDK.sharedInstance.resetSDK(licenseKey: Tenant.licenseKey)
  }
  
  
  
  func showLiveIDView(isLivenessNeeded: Bool = false) {
    let storyBoard : UIStoryboard = UIStoryboard(name: "Main", bundle:nil)
    if let liveIDVC = storyBoard.instantiateViewController(withIdentifier: "LiveIDViewController") as? LiveIDViewController {
      liveIDVC.isLivenessNeeded = isLivenessNeeded
      self.navigationController?.pushViewController(liveIDVC, animated: true)
    }
  }
}

