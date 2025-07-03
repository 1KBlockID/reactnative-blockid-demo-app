#import "Blockidplugin.h"

#import "react_native_blockidplugin-Swift.h"
@implementation Blockidplugin
RCT_EXPORT_MODULE()

BlockIdWrapper *wrapper = [[BlockIdWrapper alloc] init];

RCT_EXPORT_METHOD(isReady: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    bool result = [wrapper isReady];
    resolve(@(result));
}

RCT_EXPORT_METHOD(setLicenseKey:(NSString *)licenseKey resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    bool result = [wrapper setLicenseKeyWithLicenseKey:licenseKey];
    resolve(@(result));
}

RCT_EXPORT_METHOD(initiateTempWallet: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper initiateTempWalletWithResponse:^(BOOL status, ErrorResponse * _Nullable error) {
        if (status) {
            resolve(@(status));
        } else {
            reject(@"", @"", error);
        }
    }];
}

RCT_EXPORT_METHOD(registerTenantWith:(NSString *)tag community:(NSString *)community dns: (NSString *)dns  resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper registerTenantWithTag:tag community:community dns:dns response:^(BOOL status, ErrorResponse * _Nullable error) {
        if (status) {
            resolve(@(status));
        } else {
            reject(@"", @"", error);
        }
    }];
}

RCT_EXPORT_METHOD(enrollDeviceAuth: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper enrollDeviceAuthWithResponse:^(BOOL status, ErrorResponse * _Nullable error) {
        if (status) {
            resolve(@(status));
        } else {
            reject(@"", @"", error);
        }
    }];
}

RCT_EXPORT_METHOD(isDeviceAuthRegistered: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    bool result = [wrapper isDeviceAuthRegistered];
    resolve(@(result));
}


RCT_EXPORT_METHOD(verifyDeviceAuth: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper verifyDeviceAuthWithResponse:^(BOOL status, ErrorResponse * _Nullable error) {
        if (status) {
            resolve(@(status));
        } else {
            reject(@"", @"", error);
        }
    }];
}

RCT_EXPORT_METHOD(totp: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {

    [wrapper totpWithTotpResponse:^(NSDictionary<NSString *,id> * _Nullable response, ErrorResponse * _Nullable error) {
        if (response != nil) {
            resolve(response);
        } else {
            reject(@"", @"", error);
        }
    }];

}

RCT_EXPORT_METHOD(isLiveIDRegistered: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    bool result = [wrapper isLiveIDRegistered];
    resolve(@(result));
}

RCT_EXPORT_METHOD(enrollLiveIDScanning:(NSString *)dvcID mobileSessionID:(NSString *)mobileSessionID mobileDocumentID:(NSString *)mobileDocumentID  resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {

    [wrapper enrollLiveIDScanningWithDvcID: dvcID mobileSessionId: mobileSessionID mobileDocumentId: mobileDocumentID action: LiveIDActionRegistration response:^(NSDictionary<NSString *,id> * _Nonnull response) {
        [self sendEventWithName:@"onStatusChanged" body: response];
    }];
}

RCT_EXPORT_METHOD(verifyLiveIDScanning:(NSString *)dvcID mobileSessionID:(NSString *)mobileSessionID mobileDocumentID:(NSString *)mobileDocumentID resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {

    [wrapper enrollLiveIDScanningWithDvcID: dvcID mobileSessionId: mobileSessionID mobileDocumentId: mobileDocumentID action: LiveIDActionVerification response:^(NSDictionary<NSString *,id> * _Nonnull response) {
        [self sendEventWithName:@"onStatusChanged" body: response];
    }];
}

RCT_EXPORT_METHOD(verifyFaceWithLiveness:(NSString *)dvcID mobileSessionID:(NSString *)mobileSessionID mobileDocumentID:(NSString *)mobileDocumentID resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {

  [wrapper enrollLiveIDScanningWithDvcID: dvcID mobileSessionId: mobileSessionID mobileDocumentId: mobileDocumentID action: LiveIDActionVerifyFaceWithLiveness response:^(NSDictionary<NSString *,id> * _Nonnull response) {
        [self sendEventWithName:@"onStatusChanged" body: response];
    }];
}

RCT_EXPORT_METHOD(resetSDK:(NSString *)tag community:(NSString *)community dns: (NSString *)dns licenseKey: (NSString *)licenseKey reason: (NSString *)reason resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {

    [wrapper resetSDKWithTag:tag community:community dns:dns licenseKey:licenseKey reason:reason response:^(BOOL status, ErrorResponse * _Nullable error) {
        resolve(@(status));
    }];
}

RCT_EXPORT_METHOD(getUserDocument:(double)type resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        resolve([wrapper getUserDocumentWithType:type]);
    });
}

RCT_EXPORT_METHOD(scanDocument:(double)type resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper scanDocumentWithType:type response:^(NSString * _Nullable response, ErrorResponse * _Nullable error) {
        if (response != nil) {
            resolve(response);
        } else {
            reject(@"", @"", error);
        }
    }];
}


- (NSArray<NSString *> *)supportedEvents {
    return @[@"onStatusChanged"];
}

RCT_EXPORT_METHOD(stopLiveIDScanning:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper stopLiveIDScanning];
    resolve(@true);
}

RCT_EXPORT_METHOD(startQRScanning:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper startQRScanningWithResponse:^(NSString * _Nullable response) {
        resolve(response);
    }];
}

RCT_EXPORT_METHOD(stopQRScanning:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper stopQRScanning];
    resolve(@true);
}

RCT_EXPORT_METHOD(isUrlTrustedSessionSources:(NSString*)url resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper isUrlTrustedSessionSourcesWithUrl:url completion:^(BOOL isTrusted) {
        resolve(@(isTrusted));
    }];
}

RCT_EXPORT_METHOD(getScopesAttributesDic:(NSDictionary*)data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper getScopesAttributesDicWithData:data response:^(NSDictionary<NSString *,id> * _Nullable response, ErrorResponse * _Nullable error) {
        if (response !=nil) {
            resolve(response);
        } else {
            reject(@"", @"", error);
        }
    }];
}

RCT_EXPORT_METHOD(authenticateUserWithScopes:(NSDictionary*)data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper authenticateUserWithScopesWithData:data response:^(BOOL result, ErrorResponse * _Nullable error) {
        resolve(@(result));
    }];
}

RCT_EXPORT_METHOD(registerNationalIDWithLiveID:(NSDictionary *)data face:(NSString *)face proofedBy:(NSString *)proofedBy mobileSessionID:(NSString *)mobileSessionID mobileDocumentID:(NSString *)mobileDocumentID resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper registerNationalIDWithLiveIDWithData: data face: face proofedBy: proofedBy mobileSessionId: mobileSessionID mobileDocumentId: mobileDocumentID response: ^(BOOL status, ErrorResponse * _Nullable error) {
        if (status) {
            resolve(@(status));
        } else {
            reject(@"", @"", error);
        }
    }];
}

RCT_EXPORT_METHOD(registerDrivingLicenceWithLiveID:(NSDictionary *)data face:(NSString *)face proofedBy:(NSString *)proofedBy mobileSessionID:(NSString *)mobileSessionID mobileDocumentID:(NSString *)mobileDocumentID resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper registerDrivingLicenceWithLiveIDWithData: data face: face proofedBy: proofedBy mobileSessionId: mobileSessionID mobileDocumentId: mobileDocumentID response: ^(BOOL status, ErrorResponse * _Nullable error) {
        if (status) {
            resolve(@(status));
        } else {
            reject(@"", @"", error);
        }
    }];
}

RCT_EXPORT_METHOD(registerPassportWithLiveID:(NSDictionary *)data face:(NSString *)face proofedBy:(NSString *)proofedBy mobileSessionID:(NSString *)mobileSessionID mobileDocumentID:(NSString *)mobileDocumentID resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper registerPassportWithLiveIDWithData: data face: face proofedBy: proofedBy mobileSessionId: mobileSessionID mobileDocumentId: mobileDocumentID response: ^(BOOL status, ErrorResponse * _Nullable error) {
        if (status) {
            resolve(@(status));
        } else {
            reject(@"", @"", error);
        }
    }];
}

RCT_EXPORT_METHOD(blockIDSDKVerion: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    resolve([wrapper version]);
}

RCT_EXPORT_METHOD(getDID: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    resolve([wrapper getDID]);
}

RCT_EXPORT_METHOD(lockSDK:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper lockSDK];
    resolve(@true);
}

RCT_EXPORT_METHOD(unLockSDK:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper unLockSDK];
    resolve(@true);
}


// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeBlockidpluginSpecJSI>(params);
}
#endif


@end
