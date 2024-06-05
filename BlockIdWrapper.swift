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
    
    public typealias BlockIdDocumentScanResponse = (_ response: String?, _ error: ErrorResponse?) -> Void
    
    public typealias BlockIdQRScanResponse = (_ response: String?) -> Void
    
    public typealias BlockIdWrapperDataResponse = (_ response: [String: Any]?, _ error: ErrorResponse?) -> Void

    private var liveIdScannerHelper: LiveIDScannerHelper?
    
    private var blockIdLiveIDResponse: BlockIdLiveIDResponse!
    
    private var documentScannerViewController: DocumentScannerViewController?
    
    private var blockIdDocumentScanResponse: BlockIdDocumentScanResponse?
    
    private var blockIdWrapperResponse: BlockIdWrapperResponse?

    private var qrScannerHelper: QRScannerHelper?
    
    private var blockIdQRScanResponse: BlockIdQRScanResponse?

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
    
    func stopLiveIDScanning() {
        DispatchQueue.main.async { [unowned self]  in
            liveIdScannerHelper?.stopLiveIDScanning()
        }
    }
    
    func bidScannerView() -> BlockID.BIDScannerView {
        let scannerView = BlockID.BIDScannerView();
        return scannerView
    }
    
    func resetSDK(tag: String, community: String, dns: String, licenseKey: String, reason: String,  response: @escaping BlockIdWrapperResponse)  {
        let bidTenant = BIDTenant.makeTenant(tag: tag,
                                                        community: community,
                                                        dns: dns)
        BlockIDSDK.sharedInstance.resetSDK(licenseKey: licenseKey, rootTenant: bidTenant, reason: reason)
        response(true, nil)
     }
    
    func getUserDocument(type: Int) -> String? {
        let docType = DocType(rawValue: type)
        guard let docType = docType else {
            return nil
        }
        let strDocuments = BIDDocumentProvider.shared.getUserDocument(id: nil,
                                                                      type: docType.type,
                                                                      category: docType.category)
        return strDocuments
    }
    
    func scanDocument(type: Int, response: @escaping BlockIdDocumentScanResponse) {
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
    
    func registerNationalIDWithLiveID(data: [String: Any]?, response: @escaping BlockIdWrapperResponse) {
        blockIdWrapperResponse = response
         if var obj = validateScanedData(data: data) {
            mutateDocument(obj: &obj, key: "idcard_object", type: RegisterDocType.NATIONAL_ID.rawValue)
            if let img = validateFaceData(data: data), let proofedBy = validateProofedByData(data: data)  {
                registerDocument(obj: obj, proofedBy: proofedBy, img: img)
            }
        }
    }
    
    func registerDrivingLicenceWithLiveID(data: [String: Any]?, response: @escaping BlockIdWrapperResponse) {
        if var obj = validateScanedData(data: data) {
            mutateDocument(obj: &obj, key: "dl_object", type: RegisterDocType.DL.rawValue)
            if let img = validateFaceData(data: data), let proofedBy = validateProofedByData(data: data)  {
                registerDocument(obj: obj, proofedBy: proofedBy, img: img)
            }
        }
    }
    
    func registerPassportWithLiveID(data: [String: Any]?, response: @escaping BlockIdWrapperResponse) {
        if var obj = validateScanedData(data: data) {
            mutateDocument(obj: &obj, key: "ppt_object", type: RegisterDocType.PPT.rawValue)
            if let img = validateFaceData(data: data), let proofedBy = validateProofedByData(data: data)  {
                registerDocument(obj: obj, proofedBy: proofedBy, img: img)
            }
        }
    }

    /// Scan QR

    func startQRScanning(response: @escaping BlockIdQRScanResponse) {
        blockIdQRScanResponse = response
        DispatchQueue.main.async { [unowned self]  in
            if (qrScannerHelper?.isRunning() == false || qrScannerHelper?.isRunning() == nil) {
                qrScannerHelper = QRScannerHelper.init(bidScannerView: ScannerViewManagerHelper.sharedManager().scannerView as! BlockID.BIDScannerView,
                                                       kQRScanResponseDelegate: self)
                qrScannerHelper?.startQRScanning()
            }
        }
    }
    
    func stopQRScanning() {
        DispatchQueue.main.async { [unowned self]  in
            qrScannerHelper?.stopQRScanning()
        }
    }
    
    func isUrlTrustedSessionSources(url: String) -> Bool {
        return BlockIDSDK.sharedInstance.isTrustedSessionSources(sessionUrl: url)
    }
    
    func getScopesAttributesDic(data: [String: Any], response: @escaping BlockIdWrapperDataResponse) {
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
    
    func authenticateUserWithScopes(data: [String: Any], response: @escaping BlockIdWrapperResponse) {
        print(data)
        BlockIDSDK.sharedInstance.authenticateUser(sessionId: data["session"] as? String ?? "", sessionURL: data["sessionUrl"] as? String ?? "", creds: data["creds"] as? String ?? "", scopes: data["scopes"] as? String ?? "", lat: 0, lon: 0, origin: bidOrigin(data: data), userId: "") {(status, _, error) in
            response(status, ErrorResponse(code: error?.code ?? -1, description: error?.message ?? ""))
        }
    }

    private func getRootViewController() -> UIViewController? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                   let window = windowScene.windows.first,
              let rootViewController = window.rootViewController else { return nil }
       return rootViewController
    }
    
    private func mutateDocument(obj: inout [String: Any], key: String, type: String) {
        let token = obj["token"] as? String
        var dictIdcardObject = obj[key] as? [String: Any]
        let proof_jwt = dictIdcardObject?["proof_jwt"] as? String
        dictIdcardObject?["proof"] = proof_jwt ?? ""
        dictIdcardObject?["certificate_token"] = token ?? ""
        dictIdcardObject?["category"] = RegisterDocCategory.Identity_Document.rawValue
        dictIdcardObject?["type"] = type
        obj = dictIdcardObject ?? [:]

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


extension BlockIdWrapper: BlockID.QRScanResponseDelegate {
    public func onQRScanResult(qrCodeData: String?) {
        qrScannerHelper!.stopQRScanning()
        blockIdQRScanResponse?(qrCodeData);
    }
}

// Document Scan utils
extension BlockIdWrapper {
    
    private func registerDocument(obj: [String: Any], proofedBy: String, img: UIImage) {
        BlockIDSDK.sharedInstance.registerDocument(obj: obj,
                                                   liveIdProofedBy: proofedBy,
                                                   faceImage: img, completion: {[unowned self] status, error in
            blockIdWrapperResponse?(status, ErrorResponse(code: error?.code ?? -1, description: error?.message ?? ""))
        })
    }
    
    private func validateFaceData(data: Any?) -> UIImage? {
        guard let obj = data as? [String: Any], let liveIdFace = (obj["liveid_object"] as? [String: Any])?["face"] as? String else {
            blockIdWrapperResponse?(false, ErrorResponse(code: 0, description: "LiveIdFace cannot be nil."))
             return nil
        }
        guard let imgdata = Data(base64Encoded: liveIdFace,
                                 options: .ignoreUnknownCharacters),
              let img = UIImage(data: imgdata) else {
            blockIdWrapperResponse?(false, ErrorResponse(code: 0, description: "Not able to extract LiveIdFace."))
             return nil
        }
        return img
    }
    
    private func validateProofedByData(data: Any?) -> String? {
        guard  let obj = data as? [String: Any], let proofedBy = (obj["liveid_object"] as? [String: Any])?["proofedBy"] as? String else {
             blockIdWrapperResponse?(false, ErrorResponse(code: 0, description: "ProofedBy cannot be nil"))
             return nil
        }
        return proofedBy
    }
    
    private func validateScanedData(data: Any?) -> [String: Any]? {
        guard let obj = data as? [String: Any] else {
            blockIdWrapperResponse?(false, ErrorResponse(code: 0, description: "Data cannot be nil."))
            return nil
        }
        return obj
    }

}
