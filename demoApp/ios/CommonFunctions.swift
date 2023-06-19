//
//  CommonFunctions.swift
//  demoApp
//
//  Created by Kajal Verma on 16/06/23.
//

//
//  CommonFunctions.swift
//  BlockIDTestApp
//
//  Created by 1Kosmos Engineering
//  Copyright © 2021 1Kosmos. All rights reserved.
//

import Foundation
import UIKit
class CommonFunctions {
    
    static func getAppBundleVersion() -> (String, String) {
        let appVer = getAppVersion()
        let bundleVer = getBundleVersion()
        return (appVer, bundleVer)
    }
    
    private static func getAppVersion() -> String {
        var appVersion = ""
        if let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String {
            appVersion = version
        }
        return appVersion
    }
    
    private static func getBundleVersion() -> String {
        var hexBundleVersion = ""
        if let bVersion = Bundle.main.infoDictionary?["CFBundleVersion"] as? String {
            hexBundleVersion = String(format:"%02X", Int(bVersion)!)
        }
        return hexBundleVersion
    }

    
}
