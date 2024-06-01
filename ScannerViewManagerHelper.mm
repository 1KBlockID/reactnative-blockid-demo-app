//
//  ScannerViewManagerHelper.m
//  react-native-blockidplugin
//
//  Created by C Ramkumar on 01/06/24.
//

#import <Foundation/Foundation.h>
#import "ScannerViewManagerHelper.h"

@implementation ScannerViewManagerHelper

+ (instancetype)sharedManager {
    static ScannerViewManagerHelper *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[ScannerViewManagerHelper alloc] init];
    });
    return sharedInstance;
}

@end
