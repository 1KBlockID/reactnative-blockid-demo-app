//
//  RCTBridge.m
//  DemoApp
//

#import <React/RCTBridgeModule.h>
#import "demoApp-Swift.h"
#import "RCTBridge.h"

@implementation Fido2Module
  RCT_EXPORT_MODULE();

  RCT_EXPORT_METHOD(initRegistrations:(RCTPromiseResolveBlock)resolveFunction
                    rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
    dispatch_async(dispatch_get_main_queue(), ^{
      Fido2 *sdk = [[Fido2 alloc] initWithResolveFunction:resolveFunction
                                           rejectFunction:rejectFunction];
      [sdk initRegistrations];
    });
  }

RCT_EXPORT_METHOD(getSDKVersion:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    Fido2 *sdk = [[Fido2 alloc] initWithResolveFunction:resolveFunction
                                         rejectFunction:rejectFunction];
    NSString* BlockIdVersion = [sdk getSDKVersion];
    resolveFunction(BlockIdVersion);
  });
}

RCT_EXPORT_METHOD(register_Tenant:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    Fido2 *sdk = [[Fido2 alloc] initWithResolveFunction:resolveFunction
                                         rejectFunction:rejectFunction];
    [sdk register_Tenant];

  });
}
RCT_EXPORT_METHOD(enrollBiometricAssets:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    
    Fido2 *sdk = [[Fido2 alloc] initWithResolveFunction:resolveFunction
                                         rejectFunction:rejectFunction];
    RCTLogInfo(@"enrollBiometricAssets Called");
      [sdk enrollBiometricAssets];
  });
}

RCT_EXPORT_METHOD(getSDKInfo:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    
    Fido2 *sdk = [[Fido2 alloc] initWithResolveFunction:resolveFunction
                                         rejectFunction:rejectFunction];
    NSString* sdkTanentInfo = [sdk getSDKInfo];
    resolveFunction(sdkTanentInfo);
  });
}

@end
