//
//  AppConstants.swift
//  Demo

import Foundation
import BlockID

public struct Tenant {
  static let licenseKey = "5809b7b7-886f-4c88-9061-59a2baf485be"
  static let defaultTenant =  BIDTenant.makeTenant(tag:"1kosmos",
                                                   community: "default",
                                                   dns:"https://1k-dev.1kosmos.net/")
  static let clientTenant = BIDTenant.makeTenant(tag: "blockidpilot",
                                                 community:"default",
                                                 dns:"https://blockid-dev.1kosmos.net");
                                                                                                 
}

public struct AppConsants {
  static let buildVersion = "buildVersion"
  static let appVersionKey = "appVersionKey"
  static let dvcID = "default_config"
  static let fidoUserName = "fidoUserName"
}


