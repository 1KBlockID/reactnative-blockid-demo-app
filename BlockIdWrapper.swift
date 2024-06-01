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

    public typealias BlockIdTOTPResponse = (_ response: [String: Any]?, _ error: ErrorResponse?) -> Void
    
    public typealias BlockIdLiveIDResponse = (_ response: [String: Any]) -> Void

    private var liveIdScannerHelper: LiveIDScannerHelper?
    
    private var blockIdLiveIDResponse: BlockIdLiveIDResponse!
    
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
    
    func enrollDeviceAuth(response: @escaping BlockIdWrapperResponse)  {
        DispatchQueue.main.async {
            BIDAuthProvider.shared.enrollDeviceAuth { status, _, message in
                response(status, ErrorResponse(code: -1, description: message ?? ""))
            }
        }
    }
    
    func isDeviceAuthRegisterd() -> Bool {
        let isDeviceAuthRegisterd = BlockIDSDK.sharedInstance.isDeviceAuthRegisterd()
        return isDeviceAuthRegisterd
    }
    
    func verifyDeviceAuth(response: @escaping BlockIdWrapperResponse)  {
        DispatchQueue.main.async {
            BIDAuthProvider.shared.verifyDeviceAuth { (status, _, message) in
                response(status, ErrorResponse(code: -1, description: message ?? ""))
            }
        }
    }

    func totp(totpResponse: @escaping BlockIdTOTPResponse)  {
        let result = BlockIDSDK.sharedInstance.getTOTP()
        if (result.error == nil && result.totp != nil) {
            totpResponse(["totp": result.totp?.getTOTP() ?? "", "getRemainingSecs": result.totp?.getRemainingSecs() ?? 0], nil)
        } else {
            totpResponse(nil, ErrorResponse(code: result.error?.code ?? -1, description: result.error?.message ?? ""))
        }
    }
    
    func isLiveIDRegisterd() -> Bool {
        let isLiveIDRegisterd = BlockIDSDK.sharedInstance.isLiveIDRegisterd()
        return isLiveIDRegisterd
    }
    
    func startLiveIDScanning(dvcID: String, response: @escaping BlockIdLiveIDResponse) {
        blockIdLiveIDResponse = response
        DispatchQueue.main.async { [unowned self]  in
                 if (liveIdScannerHelper == nil) {
                     liveIdScannerHelper = LiveIDScannerHelper.init(bidScannerView: ScannerViewManagerHelper.sharedManager().scannerView as! BlockID.BIDScannerView, liveIdResponseDelegate: self)
                 }
                 liveIdScannerHelper?.startLiveIDScanning(dvcID: dvcID)
             }
    }
    
    func bidScannerView() -> BlockID.BIDScannerView {
        let scannerView = BlockID.BIDScannerView();
        return scannerView
    }
    
}


@objcMembers class ErrorResponse: NSError {
    convenience init(code: Int, description: String) {
           self.init(domain: "", code: code, userInfo: [NSLocalizedDescriptionKey: description])
    }
}

extension BlockIdWrapper: LiveIDResponseDelegate {
    public func liveIdDetectionCompleted(_ liveIdImage: UIImage?, signatureToken: String?, livenessResult: String?, error: BlockID.ErrorResponse?) {
        guard let face = liveIdImage, let signToken = signatureToken else {
 
            return
        }
        BlockIDSDK.sharedInstance.setLiveID(liveIdImage: face,
                                            liveIdProofedBy: "",
                                            sigToken: signToken,
                                            livenessResult: livenessResult) { [unowned self] (status, error) in
            if (status == true) {
                blockIdLiveIDResponse(["status": "completed"])
            } else {
                blockIdLiveIDResponse(["status": "failed", "error": ErrorResponse(code: error?.code ?? -1, description: error?.message ?? "")])
            }
        }
        liveIdScannerHelper?.stopLiveIDScanning()
    }
    
 
    public func focusOnFaceChanged(isFocused: Bool?, message: String?) {
        blockIdLiveIDResponse(["status": "focusOnFaceChanged", "info": ["isFocused": isFocused ?? false, "message": message ?? "" ]])
     }

    public func faceLivenessCheckStarted() {
        liveIdScannerHelper?.stopLiveIDScanning()
        blockIdLiveIDResponse(["status": "faceLivenessCheckStarted"])
    }
    
    public func liveIdDidDetectErrorInScanning(error: BlockID.ErrorResponse?) {
        blockIdLiveIDResponse(["status": "failed", "error": ErrorResponse(code: error?.code ?? -1, description: error?.message ?? "")])
        liveIdScannerHelper?.stopLiveIDScanning()
    }

}
