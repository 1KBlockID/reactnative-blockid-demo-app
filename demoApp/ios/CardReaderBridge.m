//
//  CardReaderBridge.m
//  Demo

#import <React/RCTBridgeModule.h>
#import "RCTBridge.h"
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(CardReaderModule, NSObject)
RCT_EXTERN_METHOD(readCard:(NSString) alertText
                  resolveFunction:(RCTPromiseResolveBlock *)resolveFunction
                  rejectFunction:(RCTPromiseRejectBlock *)rejectFunction);
@end
