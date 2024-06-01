//
//  ScannerViewManager.m
//  react-native-blockidplugin
//
//  Created by C Ramkumar on 01/06/24.
//

#import "UIKit/UIKit.h"

#import <React/RCTViewManager.h>
#import "ScannerViewManagerHelper.h"
#import "react_native_blockidplugin-Swift.h"

@interface ScannerViewManager : RCTViewManager
@end

@implementation ScannerViewManager

RCT_EXPORT_MODULE(RNTScannerView11)


- (UIView *)view
{
    UIView *view =[[UIView alloc] init];
    view.backgroundColor = [UIColor yellowColor];
    view.tag = 10;
    BlockIdWrapper *wrapper = [[BlockIdWrapper alloc] init];
    UIView *scannerView = (UIView *)[wrapper bidScannerView];
    scannerView.translatesAutoresizingMaskIntoConstraints = NO;
    [view addSubview: scannerView];
    [NSLayoutConstraint activateConstraints:@[
           [scannerView.topAnchor constraintEqualToAnchor:view.topAnchor],
           [scannerView.leadingAnchor constraintEqualToAnchor:view.leadingAnchor],
           [scannerView.trailingAnchor constraintEqualToAnchor:view.trailingAnchor],
           [scannerView.bottomAnchor constraintEqualToAnchor:view.bottomAnchor]
       ]];
    [ScannerViewManagerHelper sharedManager].scannerView = scannerView;
    return view;
}

@end
