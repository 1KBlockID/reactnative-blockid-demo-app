
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNBlockidpluginSpec.h"

@interface Blockidplugin : NSObject <NativeBlockidpluginSpec>
#else
#import <React/RCTBridgeModule.h>

@interface Blockidplugin : NSObject <RCTBridgeModule>
#endif

@end
