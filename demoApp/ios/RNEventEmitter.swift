//  Created by 1Kosmos Engineering
//  demoApp
//
//  Copyright © 2023 1Kosmos. All rights reserved.

@objc(RNEventEmitter)
open class RNEventEmitter: RCTEventEmitter {
  
  public static var emitter: RCTEventEmitter!
  
  override init() {
    super.init()
    RNEventEmitter.emitter = self
  }
  
  open override func supportedEvents() -> [String] {
    ["OnQRScanResult", "OnLiveResult"]
  }
}
