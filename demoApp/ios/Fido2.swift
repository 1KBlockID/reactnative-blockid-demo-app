//
//  Fido2.swift
//  app1
//
//  NDEF should not be present in entitlements according to:
//  https://www.themobileentity.com/home/how-to-fix-ndef-is-disallowed-error-when-uploading-nfc-enabled-app-to-app-store-connect

import Foundation
import BlockID

@objc class Fido2: NSObject {
  private static let errorCode = -1
  private static let resolvedMsg = "OK"
 

  private let resolveFunction: RCTPromiseResolveBlock
  private let rejectFunction: RCTPromiseRejectBlock

  @objc init(resolveFunction: @escaping RCTPromiseResolveBlock,
             rejectFunction: @escaping RCTPromiseRejectBlock) {
    self.resolveFunction = resolveFunction
    self.rejectFunction = rejectFunction
  }

  @objc func initRegistrations() {
    BlockIDSDK.sharedInstance.setLicenseKey(key: Tenant.licenseKey)

    ensureSDKUnlocked()
    if(!BlockIDSDK.sharedInstance.isReady()){
      initWallet()
    }
  }
  @objc func resetPin() {
    resetFidoPin()
  }
  
  @objc func setFidoPin(_ pin: String){
    setPin(pin: pin)
  }
  
  @objc func changePin(_ oldPin: String,newPin:String){
    changeFidoPin(oldPin, newPin: newPin)
  }
}

// MARK: - Private methods
extension Fido2 {
  private func initWallet() {
    guard UserDefaults.standard.data(forKey: AppConsants.dvcID) == nil else {
      BIDAuthProvider.shared.lockSDK()
      resolveFunction(Fido2.resolvedMsg)
      return
    }

    BlockIDSDK.sharedInstance.initiateTempWallet() { status, error in
      guard error == nil else {
        self.handleRejection(error: error)
        return
      }

      self.registerTenant()
    }
  }

  private func registerTenant() {
    BlockIDSDK.sharedInstance.registerTenant(tenant: Tenant.defaultTenant) {
      status, error, tenant in
      guard error == nil else {
        self.handleRejection(error: error)
        return
      }

      defer {
        BIDAuthProvider.shared.lockSDK()
      }

      do {
        let encoder = JSONEncoder()
        let data = try encoder.encode(tenant)

        BlockIDSDK.sharedInstance.commitApplicationWallet()
        UserDefaults.standard.set(data, forKey: AppConsants.dvcID)

        self.resolveFunction(Fido2.resolvedMsg)
      } catch let error {
        print("Unable to Encode Array of Notes (\(error))")
        self.rejectFunction("\(Fido2.errorCode)",
                             error.localizedDescription,
                             error)
      }
    }
  }

  private func ensureSDKUnlocked() {
    guard !BIDAuthProvider.shared.isSDKUnLocked() else { return }
    BIDAuthProvider.shared.unLockSDK()
  }

  
  private func resetFidoPin() {
    let callback = self.createResultCallback("resetPin")
    ensureSDKUnlocked()
    BlockIDSDK.sharedInstance.resetFido2(completion: callback)
  }
  
  private func changeFidoPin(_ oldPin: String,newPin :String) {
   let callback = self.createResultCallback("changePin")
    ensureSDKUnlocked()
    BlockIDSDK.sharedInstance.changeFido2PIN(oldPin:oldPin, newPin:newPin, completion:callback)
  }
  
  private func setPin(pin : String) {
    let callback = self.createResultCallback(pin)
    ensureSDKUnlocked()
    BlockIDSDK.sharedInstance.setFido2PIN(newPin: pin, completion: callback)
  }

  private func handleRejection(error: BlockID.ErrorResponse?) {
    let message = error?.message ?? "unknown error"
    let code = error?.code ?? Fido2.errorCode
    let nsError = NSError(domain: message, code: code, userInfo: nil)

    BIDAuthProvider.shared.lockSDK()
    rejectFunction("\(code)", message, nsError as Error)
  }

  private func createResultCallback(_ name: String) -> FIDO2Callback {
    return { status, error in
      guard status else {
        self.handleRejection(error: error)
        return
      }

      BIDAuthProvider.shared.lockSDK()
      UserDefaults.standard.set(name, forKey: AppConsants.fidoUserName)

      self.resolveFunction(Fido2.resolvedMsg)
    }
  }
}
