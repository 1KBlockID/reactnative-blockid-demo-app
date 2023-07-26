//
//  RCTBridge.h
//  app

#import <Foundation/Foundation.h>
#import "React/RCTBridge.h"
#import <React/RCTUtils.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>

@interface DemoAppModule : NSObject <RCTBridgeModule , RCTEvent>
@property (nonatomic, strong) UIWindow *window;
@end

 

