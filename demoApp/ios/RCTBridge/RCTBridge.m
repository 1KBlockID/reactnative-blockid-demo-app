//
//  RCTBridge.m
//  DemoApp
//

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


RCT_EXPORT_METHOD(getSDKVersion:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    NSString* BlockIdVersion = [sdk getSDKVersion];
    resolveFunction(BlockIdVersion);
  });
}
RCT_EXPORT_METHOD(getIsLiveIdRegister:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    NSString* isLiveIdRegister = [sdk getIsLiveIdRegister];
    resolveFunction(isLiveIdRegister);
  });
}

RCT_EXPORT_METHOD(registerUserKey:(NSString *)name
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk registerUserKey:name];
  });
}

RCT_EXPORT_METHOD(registerCardKeyWithPin:(NSString *)name pin:(NSString *)pin
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
      [sdk registerCardKeyWithPin:name pin:pin];
  });
}
RCT_EXPORT_METHOD(registerCardKey:(NSString *)name
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
      [sdk registerCardKey:name];
  });
}

RCT_EXPORT_METHOD(authenticateUserKey:(NSString *)name
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc]initWithResolveFunction:resolveFunction
                                            rejectFunction:rejectFunction];
    [sdk authenticateUserKey:name];
  });
}

RCT_EXPORT_METHOD(authenticateCardKeyWithPin:(NSString *)name  pin:(NSString *)pin
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk authenticateCardKeyWithPin:name pin:pin];
  });
}

RCT_EXPORT_METHOD(authenticateCardKey:(NSString *)name
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk authenticateCardKey:name];
  });
}
RCT_EXPORT_METHOD(register_Tenant:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk register_Tenant];
    
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


RCT_EXPORT_METHOD(resetSDK:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk resetSDK];
  });
}



RCT_EXPORT_METHOD(register:(NSString *)name
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
     DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                              rejectFunction:rejectFunction];
    [sdk registerWeb:name];
   });
 }

RCT_EXPORT_METHOD(StartLiveScan:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{

    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"main" bundle:nil];
    QRScanViewController *myViewController = [storyboard instantiateViewControllerWithIdentifier:@"LiveIDViewController"];
    
    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
    [rootViewController presentViewController:myViewController animated:NO completion:nil];
  });
}
RCT_EXPORT_METHOD(ScanQRCode:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"main" bundle:nil];
    QRScanViewController *myViewController = [storyboard instantiateViewControllerWithIdentifier:@"QRScanViewController"];
    
    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
    [rootViewController presentViewController:myViewController animated:NO completion:nil];
  });
}



RCT_EXPORT_METHOD(authenticate:(NSString *)name
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
      [sdk authenticate:name];
  });
  
}
RCT_EXPORT_METHOD(setFidoPin:(NSString *)pin
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    
    [sdk setFidoPin:pin];
  });
}

RCT_EXPORT_METHOD(changePin:(NSString *)oldPin  pin:(NSString *)newPin
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk changePin:oldPin newPin:newPin];
  });
}

RCT_EXPORT_METHOD(resetPin:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    DemoApp *sdk = [[DemoApp alloc] initWithResolveFunction:resolveFunction
                                             rejectFunction:rejectFunction];
    [sdk resetPin];
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
    [sdk autheticate_user:userId session:session creds:creds scope:scope sessionUrl:sessionUrl tag:tag name:name  pubicKey:publicKey];
  });
}
@end


