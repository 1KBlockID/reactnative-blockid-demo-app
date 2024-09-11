//
//  BlockIdWrapper.swift
//  react-native-blockidplugin
//
//  Created by C Ramkumar on 31/05/24.
//

import Foundation
import BlockID


@objc public enum LiveIDAction: Int {
    case registration
    case verification
}

@objcMembers public class BlockIdWrapper: NSObject {
    
    public typealias BlockIdWrapperResponse = (_ success: Bool, _ error: ErrorResponse?) -> Void

    public typealias BlockIdTOTPResponse = (_ response: [String: Any]?, _ error: ErrorResponse?) -> Void
    
    public typealias BlockIdLiveIDResponse = (_ response: [String: Any]) -> Void
    
    public typealias BlockIdDocumentScanResponse = (_ response: String?, _ error: ErrorResponse?) -> Void
    
    public typealias BlockIdQRScanResponse = (_ response: String?) -> Void
    
    public typealias BlockIdWrapperDataResponse = (_ response: [String: Any]?, _ error: ErrorResponse?) -> Void

    private var liveIdScannerHelper: LiveIDScannerHelper?
    
    private var blockIdLiveIDResponse: BlockIdLiveIDResponse?
    
    private var documentScannerViewController: DocumentScannerViewController?
    
    private var blockIdDocumentScanResponse: BlockIdDocumentScanResponse?
    
    private var blockIdWrapperResponse: BlockIdWrapperResponse?

    private var qrScannerHelper: QRScannerHelper?
    
    private var blockIdQRScanResponse: BlockIdQRScanResponse?
    
    private var liveIDAction: LiveIDAction = .registration

    public func version() -> NSString {
        return (BlockIDSDK.sharedInstance.getVersion() ?? "") as NSString
    }
    
    public func getDID() -> NSString {
        return BlockIDSDK.sharedInstance.getDID() as NSString
    }
    
    public func setLicenseKey(licenseKey: String) -> Bool {
        BlockIDSDK.sharedInstance.setLicenseKey(key: licenseKey)
        return true;
    }
    
    public func isReady() -> Bool {
        return BlockIDSDK.sharedInstance.isReady()
    }
    
    // MARK: Tenant Registration
    
    public func initiateTempWallet(response: @escaping BlockIdWrapperResponse) {
        guard !BlockIDSDK.sharedInstance.isReady() else {
            response(false, ErrorResponse(code: -1, description: "BlockIDSDK is not ready."))
            return
        }
        BlockIDSDK.sharedInstance.initiateTempWallet() { (status, error) in
            response(status, ErrorResponse(code: error?.code ?? -1, description: error?.message ?? ""))
         }
    }
    
    public func registerTenant(tag: String, community: String, dns: String, response: @escaping BlockIdWrapperResponse)  {
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
    
    // MARK: Device Auth Registration
    
    public func enrollDeviceAuth(response: @escaping BlockIdWrapperResponse)  {
        DispatchQueue.main.async {
            BIDAuthProvider.shared.enrollDeviceAuth { status, _, message in
                response(status, ErrorResponse(code: -1, description: message ?? ""))
            }
        }
    }
    
    public func isDeviceAuthRegisterd() -> Bool {
        let isDeviceAuthRegisterd = BlockIDSDK.sharedInstance.isDeviceAuthRegisterd()
        return isDeviceAuthRegisterd
    }
    
    public func verifyDeviceAuth(response: @escaping BlockIdWrapperResponse)  {
        DispatchQueue.main.async {
            BIDAuthProvider.shared.verifyDeviceAuth { (status, _, message) in
                response(status, ErrorResponse(code: -1, description: message ?? ""))
            }
        }
    }

    // MARK: QR Scan

    public func startQRScanning(response: @escaping BlockIdQRScanResponse) {
        blockIdQRScanResponse = response
        DispatchQueue.main.async { [unowned self]  in
            if (qrScannerHelper?.isRunning() == false || qrScannerHelper?.isRunning() == nil) {
                qrScannerHelper = QRScannerHelper.init(bidScannerView: ScannerViewRef.shared.scannerView as! BlockID.BIDScannerView,
                                                       kQRScanResponseDelegate: self)
                qrScannerHelper?.startQRScanning()
            }
        }
    }
    
    public func stopQRScanning() {
        DispatchQueue.main.async { [unowned self]  in
            qrScannerHelper?.stopQRScanning()
        }
    }
    
    public func isUrlTrustedSessionSources(url: String) -> Bool {
        return BlockIDSDK.sharedInstance.isTrustedSessionSources(sessionUrl: url)
    }
    
    public func getScopesAttributesDic(data: [String: Any], response: @escaping BlockIdWrapperDataResponse) {
        let bidOrigin = bidOrigin(data: data)
        if (bidOrigin.authPage == nil) { //default to native auth without a specific method.
            bidOrigin.authPage = AccountAuthConstants.kNativeAuthScehema
        }
        BlockIDSDK.sharedInstance.getScopesAttributesDic(scopes: data["scopes"] as? String ?? "",
                                                             creds: data["creds"] as? String ?? "",
                                                             origin: bidOrigin,
                                                         userId: nil) { scopesAttributesDict, error in
            guard let scopeDictionary = scopesAttributesDict else {
                response(nil, ErrorResponse(code: error?.code ?? -1, description: error?.message ?? ""))
                return
            }
            response(scopeDictionary, nil)
        }
    }
    
    public func authenticateUserWithScopes(data: [String: Any], response: @escaping BlockIdWrapperResponse) {
        BlockIDSDK.sharedInstance.authenticateUser(sessionId: data["session"] as? String ?? "", sessionURL: data["sessionUrl"] as? String ?? "", creds: data["creds"] as? String ?? "", scopes: data["scopes"] as? String ?? "", lat: 0, lon: 0, origin: bidOrigin(data: data), userId: "") {(status, _, error) in
            response(status, ErrorResponse(code: error?.code ?? -1, description: error?.message ?? ""))
        }
    }
    
    // MARK: TOTP
    
    public func totp(totpResponse: @escaping BlockIdTOTPResponse)  {
        let result = BlockIDSDK.sharedInstance.getTOTP()
        if (result.error == nil && result.totp != nil) {
            totpResponse(["totp": result.totp?.getTOTP() ?? "", "getRemainingSecs": result.totp?.getRemainingSecs() ?? 0], nil)
        } else {
            totpResponse(nil, ErrorResponse(code: result.error?.code ?? -1, description: result.error?.message ?? ""))
        }
    }
    
    // MARK: LiveID Scan
    
    public func isLiveIDRegisterd() -> Bool {
        let isLiveIDRegisterd = BlockIDSDK.sharedInstance.isLiveIDRegisterd()
        return isLiveIDRegisterd
    }
    
    public func enrollLiveIDScanning(dvcID: String, action: LiveIDAction, response: @escaping BlockIdLiveIDResponse) {
        blockIdLiveIDResponse = response
        self.liveIDAction = action
        DispatchQueue.main.async { [unowned self]  in
            liveIdScannerHelper?.stopLiveIDScanning()
            liveIdScannerHelper = nil
            if (liveIdScannerHelper == nil) {
                liveIdScannerHelper = LiveIDScannerHelper.init(bidScannerView: ScannerViewRef.shared.scannerView as! BlockID.BIDScannerView, liveIdResponseDelegate: self)
            }
            liveIdScannerHelper?.startLiveIDScanning(dvcID: dvcID)
        }
    }
    
    public func stopLiveIDScanning() {
        DispatchQueue.main.async { [unowned self]  in
            liveIdScannerHelper?.stopLiveIDScanning()
        }
    }
    
    public func bidScannerView() -> BlockID.BIDScannerView {
        let scannerView = BlockID.BIDScannerView();
        return scannerView
    }

    // MARK: Document Scan
    
    public func getUserDocument(type: Int) -> String? {
        let docType = DocType(rawValue: type)
        guard let docType = docType else {
            return nil
        }
        let strDocuments = BIDDocumentProvider.shared.getUserDocument(id: nil,
                                                                      type: docType.type,
                                                                      category: docType.category)
        return strDocuments
    }
    
    public func scanDocument(type: Int, response: @escaping BlockIdDocumentScanResponse) {
        blockIdDocumentScanResponse = response

        let docType = DocType(rawValue: type)
        guard let docType = docType else {
            response(nil, ErrorResponse(code: -1, description: "Document type should not be nil"))
            return
        }
        
        DispatchQueue.main.async {[unowned self] in

        guard let rootViewController = getRootViewController() else {
            response(nil, ErrorResponse(code: -1, description: "RootViewController is nil"))
            return
        }
            if  documentScannerViewController == nil {
                documentScannerViewController = DocumentScannerViewController(docType: docType.docScannerType,
                                                                              delegate: self)
            }
            if let navigationController = rootViewController as? UINavigationController {
                navigationController.pushViewController(documentScannerViewController!, animated: true)
            } else if let navigationController = rootViewController.navigationController {
                navigationController.pushViewController(documentScannerViewController!, animated: true)
            } else if let navigationController = rootViewController.presentedViewController as? UINavigationController {
                navigationController.pushViewController(documentScannerViewController!, animated: true)
            } else {
                rootViewController.present(documentScannerViewController!, animated: true, completion: nil)
            }
        }
    }
    
    public func registerNationalIDWithLiveID(data: [String: Any]?, face: String, proofedBy: String,  response: @escaping BlockIdWrapperResponse) {
        guard var obj = data, let image = faceData(data: face) else {
            response(false, ErrorResponse(code: -1, description: "data and face cannot be nil"))
            return
        }
        blockIdWrapperResponse = response
        obj["type"] = RegisterDocType.NATIONAL_ID.rawValue
        obj["category"] = RegisterDocCategory.Identity_Document.rawValue
        registerDocument(obj: obj, proofedBy: proofedBy, img: image)
    }
    
    public func registerDrivingLicenceWithLiveID(data: [String: Any]?, face: String, proofedBy: String, response: @escaping BlockIdWrapperResponse) {
        guard var obj = data, let image = faceData(data: face) else {
            response(false, ErrorResponse(code: -1, description: "data and face cannot be nil"))
            return
        }
        blockIdWrapperResponse = response
        obj["type"] = RegisterDocType.DL.rawValue
        obj["category"] = RegisterDocCategory.Identity_Document.rawValue
        registerDocument(obj: obj, proofedBy: proofedBy, img: image)
    }
    
    public func registerPassportWithLiveID(data: [String: Any]?, face: String, proofedBy: String, response: @escaping BlockIdWrapperResponse) {
        guard var obj = data, let image = faceData(data: face) else {
            response(false, ErrorResponse(code: -1, description: "data and face cannot be nil"))
            return
        }
        blockIdWrapperResponse = response
        obj["type"] = RegisterDocType.PPT.rawValue
        obj["category"] = RegisterDocCategory.Identity_Document.rawValue
        registerDocument(obj: obj, proofedBy: proofedBy, img: image)
    }

    // MARK: Reset SDK
    
    public func resetSDK(tag: String, community: String, dns: String, licenseKey: String, reason: String,  response: @escaping BlockIdWrapperResponse)  {
        let bidTenant = BIDTenant.makeTenant(tag: tag,
                                                        community: community,
                                                        dns: dns)
        DispatchQueue.main.async {
            BlockIDSDK.sharedInstance.resetSDK(licenseKey: licenseKey, rootTenant: bidTenant, reason: reason)
            response(true, nil)
        }
     }

}


@objcMembers public class ErrorResponse: NSError {
    convenience init(code: Int, description: String) {
           self.init(domain: "", code: code, userInfo: [NSLocalizedDescriptionKey: description])
    }
}

// MARK: QRScanResponseDelegate

extension BlockIdWrapper: BlockID.QRScanResponseDelegate {
    public func onQRScanResult(qrCodeData: String?) {
        qrScannerHelper?.stopQRScanning()
        blockIdQRScanResponse?(qrCodeData);
    }
}

// MARK: LiveIDResponseDelegate

extension BlockIdWrapper: LiveIDResponseDelegate {
    public func liveIdDetectionCompleted(_ liveIdImage: UIImage?, signatureToken: String?, livenessResult: String?, error: BlockID.ErrorResponse?) {
        guard let face = liveIdImage, let signToken = signatureToken else {
            blockIdLiveIDResponse?(["status": "failed", "error": ["code": error?.code ?? -1, "description": error?.message ?? ""]])
            return
        }
 
        switch liveIDAction {
        case .registration: self.registerLiveID(image: face, token: signToken, livenessResult: livenessResult)
        case .verification: self.verifyLiveID(image: face, token: signToken, livenessResult: livenessResult)
        }
        liveIdScannerHelper?.stopLiveIDScanning()
    }
 
    public func focusOnFaceChanged(isFocused: Bool?, message: String?) {
        blockIdLiveIDResponse?(["status": "focusOnFaceChanged", "info": ["isFocused": isFocused ?? false, "message": message ?? "" ]])
     }

    public func faceLivenessCheckStarted() {
        liveIdScannerHelper?.stopLiveIDScanning()
        blockIdLiveIDResponse?(["status": "faceLivenessCheckStarted"])
    }
    
    public func liveIdDidDetectErrorInScanning(error: BlockID.ErrorResponse?) {
        blockIdLiveIDResponse?(["status": "failed", "error": ["code": error?.code ?? -1, "description": error?.message ?? ""]])
        liveIdScannerHelper?.stopLiveIDScanning()
    }
    
    private func registerLiveID(image: UIImage, token: String, livenessResult: String?) {
        BlockIDSDK.sharedInstance.setLiveID(liveIdImage: image,
                                            liveIdProofedBy: "",
                                            sigToken: token,
                                            livenessResult: livenessResult) { [weak self] (status, error) in
            if (status == true) {
                self?.blockIdLiveIDResponse?(["status": "completed"])
            } else {
                self?.blockIdLiveIDResponse?(["status": "failed", "error": ["code": error?.code ?? -1, "description": error?.message ?? ""]])
            }
        }
    }
    
    private func verifyLiveID(image: UIImage, token: String, livenessResult: String?) {
        BlockIDSDK.sharedInstance.verifyLiveID(image: image,
                                               sigToken: token,
                                               livenessResult: livenessResult) { [weak self] (status, error) in
            if (status == true) {
                self?.blockIdLiveIDResponse?(["status": "completed"])
            } else {
                self?.blockIdLiveIDResponse?(["status": "failed", "error": ["code": error?.code ?? -1, "description": error?.message ?? ""]])
            }
        }
    }

}

// MARK: DocumentScanDelegate

extension BlockIdWrapper: DocumentScanDelegate {
    public func onDocumentScanResponse(status: Bool, document: String?, error: BlockID.ErrorResponse?) {
        documentScannerViewController?.dismiss(animated: false)
        documentScannerViewController = nil
        blockIdDocumentScanResponse?(document, ErrorResponse(code: error?.code ?? -1, description: error?.message ?? ""))
    }
}

private enum DocType: Int {
    case nationalId = 1
    case drivingLicence = 2
    case passport = 3
    
    var type: String {
         switch self {
         case .nationalId:
             return RegisterDocType.NATIONAL_ID.rawValue
         case .drivingLicence:
             return RegisterDocType.DL.rawValue
         case .passport:
             return RegisterDocType.PPT.rawValue
         }
     }
    
    var docScannerType: DocumentScannerType {
        switch self {
        case .nationalId:
            return DocumentScannerType.IDCARD
        case .drivingLicence:
            return DocumentScannerType.DL
        case .passport:
            return DocumentScannerType.PPT
        }
    }
    
    var category: String {
         switch self {
         default: return RegisterDocCategory.Identity_Document.rawValue
         }
     }
    
}

// MARK: Util methods
extension BlockIdWrapper {
    
    private func getRootViewController() -> UIViewController? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                   let window = windowScene.windows.first,
              let rootViewController = window.rootViewController else { return nil }
       return rootViewController
    }

    private func bidOrigin(data: [String: Any]) -> BIDOrigin {
        let bidOrigin = BIDOrigin()
        bidOrigin.api = data["api"] as? String ?? ""
        bidOrigin.tag = data["tag"] as? String ?? ""
        bidOrigin.name = data["name"] as? String ?? ""
        bidOrigin.community = data["community"] as? String ?? ""
        bidOrigin.publicKey = data["publicKey"] as? String ?? ""
        bidOrigin.session = data["session"] as? String ?? ""
        bidOrigin.authPage = data["authPage"] as? String ??  AccountAuthConstants.kNativeAuthScehema
        return bidOrigin
    }
    
    private func registerDocument(obj: [String: Any], proofedBy: String, img: UIImage) {
        DispatchQueue.main.async { [weak self] in
            BlockIDSDK.sharedInstance.registerDocument(obj: obj,
                                                       liveIdProofedBy: proofedBy,
                                                       faceImage: img, completion: {[unowned self] status, error in
                
                self?.blockIdWrapperResponse?(status, ErrorResponse(code: error?.code ?? -1, description: error?.message ?? ""))
            })
        }
    }

    private func faceData(data: String?) -> UIImage? {
        guard let data = data, let imgdata = Data(base64Encoded: data,
                                 options: .ignoreUnknownCharacters),
              let img = UIImage(data: imgdata) else {
            return nil
        }
        return img
    }

}


