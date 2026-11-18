//
//  ScannerViewManager.m
//  react-native-blockidplugin
//
//  Created by C Ramkumar on 16/06/24.
//


#import "UIKit/UIKit.h"

#import <React/RCTViewManager.h>
// MOB-7471: Under the New Architecture (Fabric), legacy RCTViewManager-backed views only
// render through the interop layer if their name is registered. RNTScannerView/ScannerManager
// are legacy views, so register them with the interop layer at load time. Guarded by
// __has_include so this compiles on both Old and New Architecture builds.
#if __has_include(<React/RCTLegacyViewManagerInteropComponentView.h>)
#import <React/RCTLegacyViewManagerInteropComponentView.h>
#define RNT_HAS_LEGACY_INTEROP 1
#endif
#if __has_include(<react_native_blockidplugin/react_native_blockidplugin-Swift.h>)
#import <react_native_blockidplugin/react_native_blockidplugin-Swift.h>
#else
#import "react_native_blockidplugin-Swift.h"
#endif

@interface ScannerViewManager : RCTViewManager
@end

#ifdef RNT_HAS_LEGACY_INTEROP
// Use a C constructor (not +load) to avoid colliding with any other +load in the module.
__attribute__((constructor)) static void RNTRegisterScannerInterop(void)
{
  if ([RCTLegacyViewManagerInteropComponentView
          respondsToSelector:@selector(supportLegacyViewManagerWithName:)]) {
    [RCTLegacyViewManagerInteropComponentView supportLegacyViewManagerWithName:@"RNTScannerView"];
    [RCTLegacyViewManagerInteropComponentView supportLegacyViewManagerWithName:@"ScannerManager"];
  }
}
#endif

@implementation ScannerViewManager

RCT_EXPORT_MODULE(RNTScannerView)


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
    [ScannerViewRef shared].scannerView = scannerView;
    return view;
}

@end
