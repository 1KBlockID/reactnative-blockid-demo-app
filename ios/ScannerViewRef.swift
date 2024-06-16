//
//  ScannerViewRef.swift
//  react-native-blockidplugin
//
//  Created by C Ramkumar on 16/06/24.
//

import Foundation
import UIKit

@objcMembers public class ScannerViewRef: NSObject  {

    @objc
    public static let shared = ScannerViewRef()
    private override init() {}
    
    @objc
    public var scannerView: UIView?
}
