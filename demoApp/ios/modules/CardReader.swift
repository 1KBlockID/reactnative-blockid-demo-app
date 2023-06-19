//
//  CardReader.swift
//  Demo
//

import Foundation
import CoreNFC

enum NFCError: Int {
    case unexpected = 1,
         notSupported,
         cardDetection
}

@objc(CardReaderModule)
class CardReaderModule: NSObject {
  private let errorInvalidated = 200

  private var session: NFCTagReaderSession?
  private var resolve: RCTPromiseResolveBlock?
  private var reject: RCTPromiseRejectBlock?

  @objc func readCard(_ alertText: String,
                      resolveFunction: @escaping RCTPromiseResolveBlock,
                      rejectFunction: @escaping RCTPromiseRejectBlock) {
    self.resolve = resolveFunction
    self.reject = rejectFunction

    beginScanning(alertText)
  }

  deinit {
    session?.invalidate()
  }
}

// MARK: - Private methods
extension CardReaderModule {
  private func beginScanning(_ message: String) {
    guard NFCTagReaderSession.readingAvailable else {
      handleRejection(.notSupported, message: "this device doesn't support card scanning.")
      return
    }

    session = NFCTagReaderSession(pollingOption: .iso14443, delegate: self)
    session?.alertMessage = message
    session?.begin()
  }

  private func handleResolve(_ id: String) {
    resolve?(id)
    session?.invalidate()
  }

  private func handleRejection(_ code: NFCError, message: String?, error: Error? = nil) {
    let message = error?.localizedDescription ?? message ?? "unknown error"
    let errorObj = error ?? NSError(domain: message, code: code.rawValue)
    let errorCode = code.rawValue

    reject?("\(errorCode)", message, errorObj)
    session?.invalidate(errorMessage: message)
  }
}

// MARK: - NFCTagReaderSessionDelegate
extension CardReaderModule: NFCTagReaderSessionDelegate {
  func tagReaderSessionDidBecomeActive(_ session: NFCTagReaderSession) {
    print("reader session active")
  }

  func tagReaderSession(_ session: NFCTagReaderSession, didInvalidateWithError error: Error) {
    guard (error as NSError).code != errorInvalidated else { return }
    handleRejection(.unexpected, message: nil, error: error)
  }

  func tagReaderSession(_ session: NFCTagReaderSession, didDetect tags: [NFCTag]) {
    guard let tag = tags.first else {
      handleRejection(.cardDetection, message: "card detection error")
      return
    }

    if case let .iso7816(cardTag) = tag {
      // Convert the card ID to uppercased hexadecimal
      let id = cardTag.identifier
        .map { String(format: "%.2hhX", $0) }
        .joined()

      handleResolve(id)
    }
  }
}
