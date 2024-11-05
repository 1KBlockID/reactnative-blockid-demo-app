package com.blockidplugin

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap


abstract class BlockidpluginSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  abstract fun setLicenseKey(licenseKey: String, promise: Promise)

  abstract fun isReady(promise: Promise)

  abstract fun initiateTempWallet(promise: Promise)

  abstract fun registerTenantWith(tag: String, community: String, dns: String, promise: Promise)

  abstract fun enrollDeviceAuth(promise: Promise)

  abstract fun isDeviceAuthRegisterd(promise: Promise)

  abstract fun verifyDeviceAuth(promise: Promise)

  abstract fun totp(promise: Promise)

  abstract fun isLiveIDRegisterd(promise: Promise)

  abstract fun enrollLiveIDScanning(dvcID: String,
                                    mobileSessionID: String?,
                                    mobileDocumentID: String?,
                                    promise: Promise)

  abstract fun verifyLiveIDScanning(dvcID: String,
                                    mobileSessionID: String?,
                                    mobileDocumentID: String?,
                                    promise: Promise)

  abstract fun stopLiveIDScanning(promise: Promise)

  abstract fun resetSDK(
    tag: String,
    community: String,
    dns: String,
    licenseKey: String,
    reason: String,
    promise: Promise
  )

  abstract fun startQRScanning(promise: Promise)

  abstract fun stopQRScanning(promise: Promise)

  abstract fun isUrlTrustedSessionSources(url: String, promise: Promise)

  abstract fun getScopesAttributesDic(data: ReadableMap, promise: Promise)

  abstract fun authenticateUserWithScopes(data: ReadableMap, promise: Promise)

  abstract fun getUserDocument(type: Double, promise: Promise)

  abstract fun scanDocument(type: Double, promise: Promise)

  abstract fun registerNationalIDWithLiveID(
    data: ReadableMap?,
    face: String?,
    proofedBy: String?,
    mobileSessionID: String?,
    mobileDocumentID: String?,
    promise: Promise?
  )

  abstract fun registerDrivingLicenceWithLiveID(
    data: ReadableMap?,
    face: String?,
    proofedBy: String?,
    mobileSessionID: String?,
    mobileDocumentID: String?,
    promise: Promise?
  )

  abstract fun registerPassportWithLiveID(
    data: ReadableMap?,
    face: String?,
    proofedBy: String?,
    mobileSessionID: String?,
    mobileDocumentID: String?,
    promise: Promise?
  )

   abstract fun blockIDSDKVerion(promise: Promise)

   abstract fun getDID(promise: Promise)

   abstract fun lockSDK(promise: Promise)

   abstract fun unLockSDK(promise: Promise)
}
