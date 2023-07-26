//
//  RNEventEmitter.swift
//  demoApp
//
//  Created by Kajal Verma on 21/07/23.
//
@objc(RNEventEmitter)
open class RNEventEmitter: RCTEventEmitter {

  public static var emitter: RCTEventEmitter!

  override init() {
    super.init()
    RNEventEmitter.emitter = self
  }

  open override func supportedEvents() -> [String] {
    ["OnQRScanResult", "onPending", "onFailure"]      // etc.
  }
}
