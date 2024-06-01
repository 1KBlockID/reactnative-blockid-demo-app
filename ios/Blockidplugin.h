
//#ifdef RCT_NEW_ARCH_ENABLED
#import "RNBlockidpluginSpec.h"
#import <React/RCTEventEmitter.h>

@interface Blockidplugin : RCTEventEmitter <NativeBlockidpluginSpec, RCTBridgeModule>
//#else
//#import <React/RCTBridgeModule.h>
//
//@interface Blockidplugin : NSObject <>
//#endif

@end
