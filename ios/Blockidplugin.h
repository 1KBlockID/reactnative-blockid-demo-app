
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNBlockidpluginSpec.h"
@interface Blockidplugin : RCTEventEmitter <NativeBlockidpluginSpec, RCTBridgeModule>
#else


@interface Blockidplugin : RCTEventEmitter <RCTBridgeModule>
#endif

@end
