//
//  RCTBridge.m
//  Demo
//

#import <React/RCTBridgeModule.h>
#import "demoApp-Bridging-Header.h"
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

RCT_EXPORT_METHOD(setFidoPin:(NSString *)pin
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    Fido2 *sdk = [[Fido2 alloc] initWithResolveFunction:resolveFunction
                                         rejectFunction:rejectFunction];
    
    [sdk setFidoPin: pin];
  });
}

RCT_EXPORT_METHOD(resetPin:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction){
  dispatch_async(dispatch_get_main_queue(), ^{
    Fido2 *sdk = [[Fido2 alloc] initWithResolveFunction:resolveFunction
                                         rejectFunction:rejectFunction];
      [sdk resetPin];
  });
}


RCT_EXPORT_METHOD(changePin:(NSString *)oldPin  pin:(NSString *)newPin
                  resolveFunction:(RCTPromiseResolveBlock)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock)rejectFunction) {
  dispatch_async(dispatch_get_main_queue(), ^{
    Fido2 *sdk = [[Fido2 alloc] initWithResolveFunction:resolveFunction
                                         rejectFunction:rejectFunction];
    [sdk changePin:oldPin newPin:newPin];
  });
}

@end
