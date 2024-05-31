//
//  BlockIdWrapper.swift
//  react-native-blockidplugin
//
//  Created by C Ramkumar on 31/05/24.
//

import Foundation
import BlockID

@objcMembers class BlockIdWrapper: NSObject {
    func version() -> NSString {
        return (BlockIDSDK.sharedInstance.getVersion() ?? "no version") as NSString
    }
}
