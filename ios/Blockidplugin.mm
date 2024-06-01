#import "Blockidplugin.h"

#import "react_native_blockidplugin-Swift.h"

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
