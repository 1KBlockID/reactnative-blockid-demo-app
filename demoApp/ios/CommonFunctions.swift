//  Created by 1Kosmos Engineering
//  demoApp
//
//  Copyright © 2023 1Kosmos. All rights reserved.

import Foundation
import UIKit

class CommonFunctions {
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
  
  static func jsonStringToObject<T>(json: String) -> T? where T : Decodable {
    do {
      let data = json.data(using: .utf8)!
      let decoder = JSONDecoder()
      let ret = try decoder.decode(T.self, from: data)
      return ret
    } catch {
    }
    
    return nil
  }
}
