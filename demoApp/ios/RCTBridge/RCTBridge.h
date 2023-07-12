//
//  RCTBridge.h
//  app

#import <Foundation/Foundation.h>
#import "React/RCTBridge.h"
#import <React/RCTUtils.h>
#import <React/RCTViewManager.h>

@interface DemoAppModule : NSObject <RCTBridgeModule>
@property (nonatomic, strong) UIWindow *window;
@end

 

