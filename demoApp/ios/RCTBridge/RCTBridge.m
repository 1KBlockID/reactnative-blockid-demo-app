//  Created by 1Kosmos Engineering
//  demoApp
//
//  Copyright © 2023 1Kosmos. All rights reserved.

#import <React/RCTBridgeModule.h>
#import "demoApp-Swift.h"
#import "RCTBridge.h"
#import <React/RCTViewManager.h>
#import "demoApp-Bridging-Header.h"


@implementation DemoAppModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initRegistrations:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk initRegistrations];
  });
}

RCT_EXPORT_METHOD(beginRegistration:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk beginRegistration];
    
  });
}

RCT_EXPORT_METHOD(enrollBiometricAssets:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk enrollBiometricAssets];
  });
}

RCT_EXPORT_METHOD(getSDKInfo:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    NSString* sdkTanentInfo = [sdk getSDKInfo];
    resolveFunction(sdkTanentInfo);
  });
}

RCT_EXPORT_METHOD(scanQRCode:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"main" bundle:nil];
    QRScanViewController *myViewController = [storyboard instantiateViewControllerWithIdentifier:@"QRScanViewController"];
    
    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
    [rootViewController presentViewController:myViewController animated:NO completion:nil];
  });
}

RCT_EXPORT_METHOD(getScopeData:(NSString *)scope  creds:(NSString *)creds userId:(NSString *)userId
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk getScopeData:scope creds:creds userId: userId];
    
  });
}

RCT_EXPORT_METHOD(authenticateUser:(NSString *)userId session:(NSString *)session creds:(NSString *)creds scope:(NSString *)scope sessionUrl:(NSString *)sessionUrl tag:(NSString *)tag name:(NSString *)name publicKey:(NSString *)publicKey
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk authenticateUser:userId session:session creds:creds scope:scope sessionUrl:sessionUrl tag:tag name:name  pubicKey:publicKey];
  });
}

RCT_EXPORT_METHOD(startLiveScan:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"main" bundle:nil];
    QRScanViewController *myViewController = [storyboard instantiateViewControllerWithIdentifier:@"LiveIDViewController"];
    
    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
    [rootViewController presentViewController:myViewController animated:NO completion:nil];
  });
}

RCT_EXPORT_METHOD(isLiveIdRegistered:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    NSString* isLiveIdRegister = [sdk isLiveIdRegistered];
    resolveFunction(isLiveIdRegister);
  });
}

RCT_EXPORT_METHOD(registerFIDO2KeyUsingWeb:(NSString *)name
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk registerWeb:name];
  });
}

RCT_EXPORT_METHOD(authenticateFIDO2KeyUsingWeb:(NSString *)name
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
      [sdk authenticateFIDO2KeyUsingWeb:name];
  });
}

RCT_EXPORT_METHOD(registerFIDO2:(NSString *)name  platorm:(NSString *)platform pin:(NSString *)pin
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk registerFIDO2Key:name platform:platform pin:pin];
  });
}

RCT_EXPORT_METHOD(authenticateFIDO2:(NSString *)name platorm:(NSString *)platform pin:(NSString *)pin
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc]initWithResolveFunction:resolveFunction
                                            rejectFunction:rejectFunction];
    [sdk authenticateFIDO2Key:name platform:platform pin:pin];
  });
}

RCT_EXPORT_METHOD(setFIDO2PIN:(NSString *)pin
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    
    [sdk setFIDO2PIN:pin];
  });
}

RCT_EXPORT_METHOD(changeFIDO2PIN:(NSString *)oldPin  pin:(NSString *)newPin
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk changeFIDO2PIN:oldPin newPin:newPin];
  });
}

RCT_EXPORT_METHOD(resetFIDO2:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk resetFIDO2];
  });
}

RCT_EXPORT_METHOD(resetSDK:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk resetSDK];
  });
}
@end


