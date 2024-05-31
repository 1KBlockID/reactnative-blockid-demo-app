//
//  BlockIdWrapper.swift
//  react-native-blockidplugin
//
//  Created by C Ramkumar on 31/05/24.
//

import Foundation
import BlockID


@objcMembers class BlockIdWrapper: NSObject {
    
    public typealias BlockIdWrapperResponse = (_ success: Bool, _ error: ErrorResponse?) -> Void

    func version() -> NSString {
        return (BlockIDSDK.sharedInstance.getVersion() ?? "no version") as NSString
    }
    
    func setLicenseKey(licenseKey: String) -> Bool {
        BlockIDSDK.sharedInstance.setLicenseKey(key: licenseKey)
        return true;
    }
    
    func isReady() -> Bool {
        return BlockIDSDK.sharedInstance.isReady()
    }
    
    func initiateTempWallet(response: @escaping BlockIdWrapperResponse) {
        guard !BlockIDSDK.sharedInstance.isReady() else {
            response(false, ErrorResponse(code: -1, description: "BlockIDSDK is not ready."))
            return
        }
        BlockIDSDK.sharedInstance.initiateTempWallet() { (status, error) in
            response(status, ErrorResponse(code: error?.code ?? -1, description: error?.message ?? ""))
         }
    }
    
    func registerTenant(tag: String, community: String, dns: String, response: @escaping BlockIdWrapperResponse)  {
        let bidTenant = BIDTenant.makeTenant(tag: tag, community: community, dns: dns)
        BlockIDSDK.sharedInstance.registerTenant(tenant: bidTenant) { (status, error, _) in
            if !status, let error = error  {
                response(false, ErrorResponse(code: error.code, description: error.message))
                 return
            }
            BlockIDSDK.sharedInstance.commitApplicationWallet()
            response(true, nil)
         }
    }
 
}


@objcMembers class ErrorResponse: NSError {
    convenience init(code: Int, description: String) {
           self.init(domain: "", code: code, userInfo: [NSLocalizedDescriptionKey: description])
    }
    
}
