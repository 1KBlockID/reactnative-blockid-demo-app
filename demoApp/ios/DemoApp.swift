//
//  Fido2.swift
//  Demo
//
//  NDEF should not be present in entitlements according to:
//  https://www.themobileentity.com/home/how-to-fix-ndef-is-disallowed-error-when-uploading-nfc-enabled-app-to-app-store-connect

import Foundation
import BlockID

@objc class DemoApp: NSObject {
  private static let errorCode = -1
  private static let resolvedMsg = "OK"
  private static var blockIdVersion = ""
  
  private let resolveFunction: RCTPromiseResolveBlock
  private let rejectFunction: RCTPromiseRejectBlock
  
  @objc init(resolveFunction: @escaping RCTPromiseResolveBlock,
             rejectFunction: @escaping RCTPromiseRejectBlock) {
    self.resolveFunction = resolveFunction
    self.rejectFunction = rejectFunction
  }
  
  
  
  
  @objc func  resetSDK() {
    print("resetAppNSDK(\(BlockIDSDK.sharedInstance.isReady()))")
    UserDefaults.removeAllValues();
    BlockIDSDK.sharedInstance.resetSDK(licenseKey: Tenant.licenseKey)
    initRegistrations();
  }
  
  
  
  
  
  
  @objc func initRegistrations() {
    BlockIDSDK.sharedInstance.setLicenseKey(key: Tenant.licenseKey);
    
  }
  
  @objc func getSDKVersion() -> String {
    return BlockIDSDK.sharedInstance.getVersion() ?? ""
  }
  
  @objc func register_Tenant()  {
    initWallet()
  }
  
  @objc func getSDKInfo()->[String:Any] {
    ensureSDKUnlocked();
    let tenant = BlockIDSDK.sharedInstance.getTenant();
    let dns = tenant?.dns
    let tag = tenant?.tenantTag
    let tenantId=tenant?.tenantId
    let community = tenant?.community
    let communityId=tenant?.communityId
    let clientTenant = Tenant.clientTenant;
    let  clientDNS = clientTenant.dns
    let clientTag = clientTenant.tenantTag
    let clientCommunity = clientTenant.community
    let licenseKey = Tenant.licenseKey.prefix(8) + "-xxxx-xxxx-xxxx-xxxxxxxx" + Tenant.licenseKey.suffix(4);
    //    let DID = BlockIDSDK.sharedInstance.getDID();
    //    let publicKey = BlockIDSDK.sharedInstance.getWalletPublicKey();
    let sdkVersion = BlockIDSDK.sharedInstance.getVersion();
    print("tenant(\(String(describing: tenant)))");
    print("tenant(\(licenseKey))");
    
    let clientTenatDict : [String:Any] = ["community":(clientCommunity ?? ""),"dns":(clientDNS ?? ""),"tenantTag":(clientTag ?? "")]
    let tenatDict : [String:Any] = ["community":(community ?? ""),"communityId":(communityId ?? ""),"dns":(dns ?? ""),"tenantId":(tenantId ?? ""),"tenantTag":(tag ?? "")]
    let mainDict : [String:Any] = ["DID":"12345","SdkVersion":(sdkVersion ?? "" ),"clientTenant":(clientTenatDict ),"licenseKey":(licenseKey ),"publicKey":"static public key","tenant":(tenatDict )];
    print("mainDict(\(mainDict))");
    return mainDict
  }
  
  
  
  
  @objc func enrollBiometricAssets(){
    print("enrollBiometricAssets && isSdk ready",BlockIDSDK.sharedInstance.isReady());
    if(BlockIDSDK.sharedInstance.isDeviceAuthRegisterd()){
      enrollBiometric()
    }else{
      verifyBiometric()
    }
  }
  
  
  
}

// MARK: - Private methods
extension DemoApp {
  private func initWallet() {
    guard UserDefaults.standard.data(forKey: AppConsants.dvcID) == nil else {
      BIDAuthProvider.shared.lockSDK()
      resolveFunction(DemoApp.resolvedMsg)
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
    print("registerTenant(\(BlockIDSDK.sharedInstance.isReady()))")
    BlockIDSDK.sharedInstance.registerTenant(tenant: Tenant.defaultTenant) {
      status, error, tenant in
      print("registerTenant(\(status))")
      if(status){
        BlockIDSDK.sharedInstance.commitApplicationWallet()
        self.resolveFunction(DemoApp.resolvedMsg)
      }
      else{
        print("error(\(error))")
        self.handleRejection(error: error);
        
      }
    }
  }
  
  
  
  
  
  private func setVersionAndBuildNumber() {
    let (appVer, buildVerHex) = CommonFunctions.getAppBundleVersion()
    UserDefaults.standard.set(appVer, forKey: AppConsants.appVersionKey)
    UserDefaults.standard.set(buildVerHex, forKey: AppConsants.buildVersion)
  }
  
  
  
  
  
  private func ensureSDKUnlocked() {
    print("ensureSDKUnlocked\(BIDAuthProvider.shared.isSDKUnLocked())");
    guard !BIDAuthProvider.shared.isSDKUnLocked() else {return }
    BIDAuthProvider.shared.unLockSDK()
  }
  
  private func enrollBiometric() {
    BIDAuthProvider.shared.enrollDeviceAuth { isRegister, data, data1 in
      if(isRegister){
        print("isRegister\(isRegister)")
        self.resolveFunction(DemoApp.resolvedMsg)
      }
    }
  }
  
  private func verifyBiometric(){
    BIDAuthProvider.shared.verifyDeviceAuth { success, error, error1 in
      if(success){
        print("verifyBiometric\(success)")
        self.resolveFunction(DemoApp.resolvedMsg)
      }
    }
  }
  
  private func registerKey(_ name: String, type: FIDO2KeyType,pin:String) {
    guard
      let root = RCTPresentedViewController(),
      let dns = Tenant.clientTenant.dns,
      let community = Tenant.clientTenant.community
    else { return }
    
    let callback = self.createResultCallback(name)
    
    ensureSDKUnlocked()
    BlockIDSDK.sharedInstance.registerFIDO2Key(controller: root,
                                               userName: name,
                                               tenantDNS: dns,
                                               communityName: community,
                                               type: type,
                                               pin:pin,
                                               completion: callback)
  }
  
  private func authenticateKey(_ name: String, type: FIDO2KeyType,pin :String) {
    guard
      let root = RCTPresentedViewController(),
      let dns = Tenant.clientTenant.dns,
      let community = Tenant.clientTenant.community
    else { return }
    
    let callback = self.createResultCallback(name)
    
    ensureSDKUnlocked()
    BlockIDSDK.sharedInstance.authenticateFIDO2Key(controller: root,
                                                   userName: name,
                                                   tenantDNS: dns,
                                                   communityName: community,
                                                   type: type,
                                                   pin:pin,
                                                   completion: callback)
  }
  
  private func resetFidoPin() {
    let callback = self.createResultCallback("resetPin")
    ensureSDKUnlocked()
    BlockIDSDK.sharedInstance.resetFido2(completion: callback)
  }
  
  private func setPin(pin : String) {
    let callback = self.createResultCallback(pin)
    ensureSDKUnlocked()
    BlockIDSDK.sharedInstance.setFido2PIN(newPin: pin, completion: callback)
  }
  
  private func handleRejection(error: BlockID.ErrorResponse?) {
    let message = error?.message ?? "unknown error"
    let code = error?.code ?? DemoApp.errorCode
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
      
      self.resolveFunction(DemoApp.resolvedMsg)
    }
  }
}
