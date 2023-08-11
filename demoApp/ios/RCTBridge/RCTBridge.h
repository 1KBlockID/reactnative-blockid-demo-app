//  Created by 1Kosmos Engineering
//  demoApp
//
//  Copyright © 2023 1Kosmos. All rights reserved.

#import <Foundation/Foundation.h>
#import "React/RCTBridge.h"
#import <React/RCTUtils.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>

@interface DemoAppModule : NSObject <RCTBridgeModule , RCTEvent>
@property (nonatomic, strong) UIWindow *window;
@end



