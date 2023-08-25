//
//  Created by 1Kosmos Engineering
//  demoApp
//
//  Copyright © 2023 1Kosmos. All rights reserved.

import Foundation
import Alamofire

public class GetSessionDataAPI {
  static let sharedInstance = demoApp.GetSessionDataAPI()
  let kSessionAuthModelNotFound: (code: Int, message: String) = (1006, "Session auth model not found")
  
  private init() {
  }
  
  public func GetSessionDataAPI(url: String, completion: @escaping ((_ response: String?, _ message: String, _ isSuccess: Bool) -> Void)) {
    
    let headers: HTTPHeaders = ["Content-Type": "application/json"]
    Alamofire.request(url, method: .get, parameters: nil, encoding: JSONEncoding.default, headers: headers)
      .responseJSON { [self] response in
        switch response.result {
        case .success:
          guard let data = response.data else {
            completion(nil, kSessionAuthModelNotFound.1, false)
            return
          }
          let strResponse = String(decoding: data, as: UTF8.self)
          completion(strResponse, "Data fetched successfully.", true)
          
        case .failure(let error):
          // For no internet connection...
          if -1009 == (error._code) || -1020 == error._code {
            completion(nil, "NetWork Error", false)
            return
          }
          else{
            completion(nil, "Requested session is no longer available.", false)
          }
        @unknown default:
          completion(nil, "error", false)
        }
      }
  }
}
