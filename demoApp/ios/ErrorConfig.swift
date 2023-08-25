//  Created by 1Kosmos Engineering
//  demoApp
//
//  Copyright © 2023 1Kosmos. All rights reserved.

import Foundation
enum ErrorConfig {
  case noInternet
  case error
  
  var title: String {
    switch self {
    case .noInternet:
      return "You are offline!"
    case .error:
      return "Error"
    }
  }
  
  var message: String {
    switch self {
    case .noInternet:
      return "Please check your internet connection"
    case .error:
      return "Something went wrong"
    }
  }
  
}
