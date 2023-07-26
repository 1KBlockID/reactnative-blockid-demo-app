//
//  ErrorConfig.swift
//  demoApp


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
