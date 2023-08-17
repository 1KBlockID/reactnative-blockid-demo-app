//  Created by 1Kosmos Engineering
//  demoApp
//
//  Copyright © 2023 1Kosmos. All rights reserved.

import Foundation
import BlockID

@objc class DemoApp: NSObject {
  private static let errorCode = -1
  private static let resolvedMsg = "OK"
  private static var blockIdVersion = ""
  private var liveIdScannerHelper: LiveIDScannerHelper?
  private weak var responseDelegate: LiveIDResponseDelegate?
  public  var qrModel: AuthenticationPayloadV1!
  var location: (Double, Double) = (0.0, 0.0)
  
  private let resolveFunction: RCTPromiseResolveBlock
  private let rejectFunction: RCTPromiseRejectBlock
  
  @objc init(resolveFunction: @escaping RCTPromiseResolveBlock,
             rejectFunction: @escaping RCTPromiseRejectBlock) {
    self.resolveFunction = resolveFunction
    self.rejectFunction = rejectFunction
  }
  
  @objc func initRegistrations() {
    BlockIDSDK.sharedInstance.setLicenseKey(key: Tenant.licenseKey);
  }
  
  @objc func beginRegistration()  {
    initWallet()
  }
  
  @objc func enrollBiometricAssets(){
    if(BlockIDSDK.sharedInstance.isDeviceAuthRegisterd()){
      enrollBiometric()
    }else{
      verifyBiometric()
    }
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
    let DID = BlockIDSDK.sharedInstance.getDID();
    let publicKey = BlockIDSDK.sharedInstance.getWalletPublicKey();
    let sdkVersion = BlockIDSDK.sharedInstance.getVersion();
    let clientTenatDict : [String:Any] = ["community":(clientCommunity ?? ""),"dns":(clientDNS ?? ""),"tenantTag":(clientTag ?? "")]
    let tenatDict : [String:Any] = ["community":(community ?? ""),"communityId":(communityId ?? ""),"dns":(dns ?? ""),"tenantId":(tenantId ?? ""),"tenantTag":(tag ?? "")]
    let mainDict : [String:Any] = ["DID":(DID ),"sdkVersion":(sdkVersion ?? "" ),"clientTenant":(clientTenatDict ),"licenseKey":(licenseKey ),"publicKey":(publicKey ),"tenant":(tenatDict )];
    return mainDict;
  }
  
  @objc func isLiveIdRegistered() -> String {
    return BlockIDSDK.sharedInstance.isLiveIDRegisterd() ? "Yes" : "NO"
  }
  
  @objc func getScopeData(_ scope: String, creds: String,userId:String ){
    getScopeDataWithCreds(scope: scope, creds: creds, userId: userId, completion: { [self] dict in
      resolveFunction(dict)
    })
  }
  
  func getScopeDataWithCreds(scope: String, creds: String,userId:String, completion: @escaping ([String: Any]?) -> Void)  {
    qrModel = AuthenticationPayloadV1.init()
    getScopesAttributesDict(scopes: scope ,
                            creds: creds ,
                            origin: qrModel.getBidOrigin()!,
                            userId:userId != "" ? userId : nil) { scopeDict in
      completion(scopeDict)
    }
  }
  
  @objc func  autheticateUser(_ userId: String, session :String, creds:String, scope:String, sessionUrl:String,tag:String,name:String,pubicKey:String){
    let bidOrigin = BIDOrigin()
    bidOrigin.tag=tag
    bidOrigin.name=name
    bidOrigin.publicKey=pubicKey
    var dataModel: AuthRequestModel
    dataModel = AuthRequestModel(lat: self.location.0, lon: self.location.1, session: session, creds: creds , scopes: scope , origin:bidOrigin, isConsentGiven: true, userId: nil , sessionUrl: sessionUrl)
    authenticateUserWithScopes(dataModel: dataModel)
  }
  
  @objc func registerWeb(_ name: String) {
    webRegister(name, type: .CROSS_PLATFORM)
  }
  
  @objc func authenticateFIDO2KeyUsingWeb(_ name: String) {
    webAuthenticate( name, type: .CROSS_PLATFORM)
  }
  
  @objc func registerUserKey(_ name: String) {
    registerKey(name, type: .PLATFORM,pin:"")
  }
  
  @objc func authenticateUserKey(_ name: String) {
    authenticateKey( name, type: .PLATFORM, pin: "")
  }
  
  @objc func registerCardKey(_ name: String) {
    registerKey(name, type: .CROSS_PLATFORM, pin: "")
  }
  
  @objc func authenticateCardKey(_ name: String) {
    authenticateKey( name, type: .CROSS_PLATFORM, pin: "")
  }
  
  
  @objc func registerCardKeyWithPin(_ name: String, pin: String) {
    registerKey(name, type: .CROSS_PLATFORM, pin: pin)
  }
  
  @objc func authenticateCardKeyWithPin(_ name: String,pin: String) {
    authenticateKey( name, type: .CROSS_PLATFORM, pin: "")
  }
  
  @objc func setFidoPin(_ pin: String){
    setPin(pin: pin)
  }
  
  @objc func changePin(_ oldPin: String,newPin:String){
    changeFidoPin(oldPin, newPin: newPin)
  }
  
  @objc func resetPin() {
    resetFidoPin()
  }
  
  @objc func  resetSDK() {
    UserDefaults.removeAllValues();
    BlockIDSDK.sharedInstance.resetSDK(licenseKey: Tenant.licenseKey)
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
    BlockIDSDK.sharedInstance.registerTenant(tenant: Tenant.defaultTenant) {
      status, error, tenant in
      if(status){
        BlockIDSDK.sharedInstance.commitApplicationWallet()
        self.resolveFunction(DemoApp.resolvedMsg)
      }
      else{
        self.handleRejection(error: error);
        
      }
    }
  }
  
  private func enrollBiometric() {
    BIDAuthProvider.shared.enrollDeviceAuth { isRegister, data, data1 in
      if(isRegister){
        self.resolveFunction(DemoApp.resolvedMsg)
      }
    }
  }
  
  private func verifyBiometric(){
    BIDAuthProvider.shared.verifyDeviceAuth { success, error, error1 in
      if(success){
        self.resolveFunction(DemoApp.resolvedMsg)
      }
    }
  }
  
  private func getScopesAttributesDict(scopes: String, creds: String, origin: BIDOrigin, userId: String? = nil, completion: @escaping ([String: Any]?) -> Void) {
    BlockIDSDK.sharedInstance.getScopesAttributesDic(scopes: scopes,
                                                     creds: creds,
                                                     origin: origin,
                                                     userId: userId) { scopesAttributesDict, error in
      if let scopeDictionary = scopesAttributesDict {
        if let  errorUW = error, errorUW.code == CustomErrors.kUnauthorizedAccess.code {
          completion(nil)
        } else {
          completion(scopeDictionary)
        }
      } else {
        completion(nil)
      }
    }
  }
  
  private func authenticateUserWithScopes(dataModel: AuthRequestModel) {
    BlockIDSDK.sharedInstance.authenticateUser(sessionId: dataModel.session, sessionURL: dataModel.sessionUrl, creds: dataModel.creds, scopes: dataModel.scopes, lat: dataModel.lat, lon: dataModel.lon, origin: dataModel.origin, userId: dataModel.userId) { [self](status, sessionid, error) in
      if status {
        resolveFunction(status)
        
      } else {
        if error?.code == NSURLErrorNotConnectedToInternet ||
            error?.code == CustomErrors.Network.OFFLINE.code {
          let localizedMessage = "OFFLINE".localizedMessage(CustomErrors.Network.OFFLINE.code)
          resolveFunction(ErrorConfig.noInternet.title)
        } else if (error)?.code == CustomErrors.kUnauthorizedAccess.code {
          
          resolveFunction(error!.message)
        } else {
          resolveFunction(error!.message)
        }
      }
    }
  }
  
  private func webRegister(_ name: String, type: FIDO2KeyType) {
    guard
      let root = RCTPresentedViewController(),
      let dns = Tenant.clientTenant.dns,
      let community = Tenant.clientTenant.community
    else { return }
    
    let callback = self.createResultCallback(name)
    ensureSDKUnlocked()
    BlockIDSDK.sharedInstance.registerFIDO2Key(userName: name,
                                               tenantDNS: dns,
                                               communityName: community,
                                               fileName: "fido3.html",
                                               completion: callback)
  }
  
  private func webAuthenticate(_ name: String, type: FIDO2KeyType) {
    guard
      let root = RCTPresentedViewController(),
      let dns = Tenant.clientTenant.dns,
      let community = Tenant.clientTenant.community
    else { return }
    
    let callback = self.createResultCallback(name)
    
    ensureSDKUnlocked()
    BlockIDSDK.sharedInstance.authenticateFIDO2Key(userName: name,
                                                   tenantDNS: dns,
                                                   communityName: community,
                                                   fileName: "fido3.html",
                                                   completion: callback)
  }
  
  private func registerKey(_ name: String, type: FIDO2KeyType,pin:String) {
    guard
      let root = RCTPresentedViewController(),
      let dns = Tenant.clientTenant.dns,
      let community = Tenant.clientTenant.community
    else { return }
    
    let callback = self.createResultCallback(name)
    
    ensureSDKUnlocked()
    if(pin == ""){
      BlockIDSDK.sharedInstance.registerFIDO2Key(controller: root,
                                                 userName: name,
                                                 tenantDNS: dns,
                                                 communityName: community,
                                                 type: type,
                                                 completion: callback)
      
    }
    else{
      BlockIDSDK.sharedInstance.registerFIDO2Key(controller: root,
                                                 userName: name,
                                                 tenantDNS: dns,
                                                 communityName: community,
                                                 type: type,
                                                 pin:pin,
                                                 completion: callback)
    }
    
  }
  
  private func authenticateKey(_ name: String, type: FIDO2KeyType,pin :String) {
    guard
      let root = RCTPresentedViewController(),
      let dns = Tenant.clientTenant.dns,
      let community = Tenant.clientTenant.community
    else { return }
    
    let callback = self.createResultCallback(name)
    
    ensureSDKUnlocked()
    if(pin == ""){
      BlockIDSDK.sharedInstance.authenticateFIDO2Key(controller: root,
                                                     userName: name,
                                                     tenantDNS: dns,
                                                     communityName: community,
                                                     type: type,
                                                     completion: callback)
    }
    else{
      BlockIDSDK.sharedInstance.authenticateFIDO2Key(controller: root,
                                                     userName: name,
                                                     tenantDNS: dns,
                                                     communityName: community,
                                                     type: type,
                                                     pin:pin,
                                                     completion: callback)
    }
    
  }
  
  private func setPin(pin : String) {
    let callback = self.createResultCallback(pin)
    ensureSDKUnlocked()
    BlockIDSDK.sharedInstance.setFido2PIN(newPin: pin, completion: callback)
  }
  
  private func changeFidoPin(_ oldPin: String,newPin :String) {
    let callback = self.createResultCallback("changePin")
    ensureSDKUnlocked()
    BlockIDSDK.sharedInstance.changeFido2PIN(oldPin:oldPin, newPin:newPin, completion:callback)
  }
  
  private func ensureSDKUnlocked() {
    guard !BIDAuthProvider.shared.isSDKUnLocked() else {return }
    BIDAuthProvider.shared.unLockSDK()
  }
  
  private func resetFidoPin() {
    let callback = self.createResultCallback("resetPin")
    ensureSDKUnlocked()
    BlockIDSDK.sharedInstance.resetFido2(completion: callback)
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
