#import "Blockidplugin.h"

#import "react_native_blockidplugin-Swift.h"
#import "ScannerViewManagerHelper.h"
@implementation Blockidplugin
RCT_EXPORT_MODULE()

BlockIdWrapper *wrapper = [[BlockIdWrapper alloc] init];

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_EXPORT_METHOD(multiply:(double)a
                  b:(double)b
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
     resolve(@"sdfdf");
 }

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

RCT_EXPORT_METHOD(isDeviceAuthRegisterd: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    bool result = [wrapper isDeviceAuthRegisterd];

     dispatch_async(dispatch_get_main_queue(), ^{
         NSLog(@"asdf %@", NSStringFromCGRect([ScannerViewManagerHelper sharedManager].scannerView.frame));
         NSLog(@"asdf %@", NSStringFromCGRect([ScannerViewManagerHelper sharedManager].scannerView.superview.frame));
         NSLog(@"%@", NSStringFromClass([[ScannerViewManagerHelper sharedManager].scannerView class]));
         [ScannerViewManagerHelper sharedManager].scannerView.backgroundColor = [UIColor brownColor];
    });

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

RCT_EXPORT_METHOD(isLiveIDRegisterd: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    bool result = [wrapper isLiveIDRegisterd];
    resolve(@(result));
}

RCT_EXPORT_METHOD(startLiveIDScanning:(NSString *)dvcID resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [wrapper startLiveIDScanningWithDvcID: dvcID response:^(NSDictionary<NSString *,id> * _Nonnull response) {
        [self sendEventWithName:@"onStatusChanged" body: response];
    }];
}

RCT_EXPORT_METHOD(resetSDK:(NSString *)tag community:(NSString *)community dns: (NSString *)dns licenseKey: (NSString *)licenseKey reason: (NSString *)reason resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    
    [wrapper resetSDKWithTag:tag community:community dns:dns licenseKey:licenseKey reason:reason response:^(BOOL status, ErrorResponse * _Nullable error) {
        resolve(@(status));
    }];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onStatusChanged"];
}

- (void)add:(double)a b:(double)b resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
     
}


// Don't compile this code when we build for the old architecture.
//#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeBlockidpluginSpecJSI>(params);
}
//#endif

@end
