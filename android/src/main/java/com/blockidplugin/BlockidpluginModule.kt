package com.blockidplugin

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.os.Handler
import android.os.Looper
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.onekosmos.blockid.sdk.BIDAPIs.APIManager.ErrorManager
import com.onekosmos.blockid.sdk.BlockIDSDK
import com.onekosmos.blockid.sdk.authentication.BIDAuthProvider
import com.onekosmos.blockid.sdk.authentication.biometric.IBiometricResponseListener
import com.onekosmos.blockid.sdk.cameramodule.QRCodeScanner.QRScannerHelper
import com.onekosmos.blockid.sdk.cameramodule.camera.liveIDModule.ILiveIDResponseListener
import com.onekosmos.blockid.sdk.cameramodule.camera.qrCodeModule.IOnQRScanResponseListener
import com.onekosmos.blockid.sdk.cameramodule.liveID.LiveIDScannerHelper
import com.onekosmos.blockid.sdk.datamodel.AccountAuthConstants
import com.onekosmos.blockid.sdk.datamodel.BIDOrigin
import com.onekosmos.blockid.sdk.datamodel.BIDTenant
import com.onekosmos.blockid.sdk.document.BIDDocumentProvider
import com.onekosmos.blockid.sdk.document.RegisterDocType
import com.onekosmos.blockid.sdk.documentScanner.BIDDocumentDataHolder
import com.onekosmos.blockid.sdk.documentScanner.DocumentScannerActivity
import com.onekosmos.blockid.sdk.documentScanner.DocumentScannerType
import com.onekosmos.blockid.sdk.totp.TOTP
import com.onekosmos.blockid.sdk.utils.BIDUtil
import org.json.JSONObject
import android.graphics.BitmapFactory
import android.text.TextUtils
import android.util.Base64
import androidx.activity.result.contract.ActivityResultContracts
import com.facebook.react.bridge.ReadableType
import com.onekosmos.blockid.sdk.document.BIDDocumentProvider.RegisterDocCategory

class BlockidpluginModule internal constructor(context: ReactApplicationContext) :
  BlockidpluginSpec(context) {

  private var mLiveIDScannerHelper: LiveIDScannerHelper? = null
  private lateinit var documentSessionResult: ActivityResultLauncher<Intent>
  private var activity: FragmentActivity? = null
  private var docScanPromise: Promise? = null
  private var mQRScannerHelper: QRScannerHelper? = null
  private var context: ReactApplicationContext? = null

  private val mActivityEventListener = object : BaseActivityEventListener() {
//    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
//      val result = ActivityResult(resultCode, data)
//      documentSessionResult = currentActivity!!.registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
//        handleDocumentSessionResult(result)
//      }
//    }
  }

  override fun initialize() {
    super.initialize()
//    val activity = currentActivity as? FragmentActivity
//    documentSessionResult = activity!!.registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
//      handleDocumentSessionResult(result)
//    }
  }
  override fun getName(): String {
    return NAME
  }

  init {
    println("Hello $context")
    BlockIDSDK.initialize(context)
    this.context = context
  }

  @ReactMethod
  override fun setLicenseKey(licenseKey: String, promise: Promise){
    Handler(Looper.getMainLooper()).post {
      BlockIDSDK.getInstance().setLicenseKey(licenseKey)
      promise.resolve(true)
    }
  }

  @ReactMethod
  override fun isReady(promise: Promise){
    promise.resolve(BlockIDSDK.getInstance().isReady)
  }

  @ReactMethod
  override fun initiateTempWallet(promise: Promise){
    BlockIDSDK.getInstance().initiateWallet()
    promise.resolve(true)
  }

  @ReactMethod
  override fun registerTenantWith(tag: String, community: String,dns: String ,promise: Promise){
    println("registerTenantWith")
    val bidTenant = BIDTenant(tag,community,dns)
    BlockIDSDK.getInstance().registerTenant(bidTenant) { status, error, _ ->
      println("registerTenantWith, $status" )

      if (status) {
        BlockIDSDK.getInstance().commitApplicationWallet()
        promise.resolve(true)
      } else {
        println("registerTenantWith, $error" )

        promise.reject(error?.message ?: "", "")
      }
    }
  }

  @ReactMethod
  override fun enrollDeviceAuth(promise: Promise){
    Handler(Looper.getMainLooper()).post{
      BIDAuthProvider.getInstance().enrollDeviceAuth(
        currentActivity,
        "Biometric authentication",
        "Do you want to allow this app to use biometric authentication?",
        false,
        object : IBiometricResponseListener {
          override fun onNonBiometricAuth(b: Boolean) {
            promise.resolve(b)
          }
          override fun onBiometricAuthResult(success: Boolean, errorResponse: ErrorManager.ErrorResponse?) {
            promise.resolve(success)
          }
        }
      )
    }
  }

  @ReactMethod
  override fun isDeviceAuthRegisterd(promise: Promise){
    promise.resolve(BlockIDSDK.getInstance().isDeviceAuthEnrolled())
  }

  @ReactMethod
  override fun verifyDeviceAuth(promise: Promise){
    Handler(Looper.getMainLooper()).post {
      BIDAuthProvider.getInstance().verifyDeviceAuth(
        currentActivity,
        "Biometric authentication",
        "Biometric authentication required to proceed",
        false,
        object : IBiometricResponseListener {
          override fun onBiometricAuthResult(success: Boolean, error: ErrorManager.ErrorResponse?) {
            promise.resolve(success)
          }

          override fun onNonBiometricAuth(success: Boolean) {
            promise.resolve(success)
          }
        }
      )
    }
  }

  @ReactMethod
  override fun totp(promise: Promise){
    println("Hello")

    val response = BlockIDSDK.getInstance().totp
    if (response.status) {
      val totp = response.getDataObject<TOTP>()
      if (totp != null) {
        val resultMap = WritableNativeMap().apply {
          putString("totp", totp.otp)
          putInt("getRemainingSecs", totp.remainingSecs.toInt())
        }
        promise.resolve(resultMap)
      } else{
        promise.reject(response?.errorResponse?.message ?: "", "")
      }
    } else{
      promise.reject(response?.errorResponse?.message ?: "", "")
    }
  }

  @ReactMethod
  override fun isLiveIDRegisterd(promise: Promise){
    val response = BlockIDSDK.getInstance().isLiveIDRegistered
    promise.resolve(response)
  }

  @ReactMethod
  override fun startLiveIDScanning(dvcID: String,promise: Promise){

  }

  @ReactMethod
  override fun stopLiveIDScanning(promise: Promise){
      mLiveIDScannerHelper?.stopLiveIDScanning()
      promise.resolve(true)
  }

  @ReactMethod
  override fun resetSDK(tag: String, community: String, dns: String, licenseKey: String, reason: String, promise: Promise){
    Handler(Looper.getMainLooper()).post {
      val bidTenant = BIDTenant(tag, community, dns)
      BlockIDSDK.getInstance().resetSDK(licenseKey, bidTenant, reason)
      promise.resolve(true)
    }
  }

  @ReactMethod
  override fun startQRScanning(promise: Promise) {
    Handler(Looper.getMainLooper()).post {
      if (mQRScannerHelper?.isRunning == true) {
        mQRScannerHelper?.stopQRScanning()
        mQRScannerHelper = null
      }

      mQRScannerHelper =  QRScannerHelper(currentActivity, object: IOnQRScanResponseListener{
        override fun onQRScanResultResponse(p0: String?) {
          mQRScannerHelper?.stopQRScanning()
          p0?.let {
            promise.resolve(p0)
          } ?: run {
           promise.reject(
                  "Error",
                  "QRScan Failed",
                  null
                )
          }
        }
      }, ScannerViewRef.bidScannerView)
      mQRScannerHelper?.startQRScanning()
    }
  }

  @ReactMethod
  override fun stopQRScanning(promise: Promise){
    Handler(Looper.getMainLooper()).post {
      mQRScannerHelper?.stopQRScanning()
      promise.resolve(true)
    }
  }

  @ReactMethod
  override fun isUrlTrustedSessionSources(url: String,promise: Promise){
    promise.resolve(BlockIDSDK.getInstance().isTrustedSessionSource(url))
  }

  @ReactMethod
  override fun getScopesAttributesDic(data: ReadableMap, promise: Promise){
    val bidOrigin = bidOrigin(data)
    BlockIDSDK.getInstance().getScopes(null, data.getString("scopes") ?: "", data.getString("creds") ?: "", bidOrigin, "0", "0"
    ) { linkedHashMap, errorResponse ->
      if (linkedHashMap != null) {
        val convertedMap = linkedHashMap.mapValues { entry ->
          when (val value = entry.value) {
            is JSONObject -> jsonToMap(value)
            else -> value
          }
        }
        promise.resolve(convertedMap)
      } else {
        promise.reject(errorResponse?.code?.toString() ?: "0", errorResponse?.message ?: "", null)
      }
    }
  }

  @ReactMethod
  override fun authenticateUserWithScopes(data: ReadableMap, promise: Promise){
    context?.let {
      BlockIDSDK.getInstance().authenticateUser(
        it, null,
        data.getString("session") ?: "", data.getString("sessionUrl") ?: "",
        data.getString("scopes") ?: "", null, data.getString("creds") ?: "",
          bidOrigin(data), "0",
        "0", BlockIDSDK.getInstance().version, null, "" //pass auth type here
    ) { status: Boolean, sessionId: String?, error: ErrorManager.ErrorResponse? ->
        if (status) {
          promise.resolve(status)
        } else {
          promise.reject(error?.code?.toString() ?: "0", error?.message ?: "", null)
        }
    }
    }
  }


  @ReactMethod
  override fun getUserDocument(type: Double, promise: Promise){
    val docType = BIDocType.from(type.toInt())
    val strDocuments = BIDDocumentProvider.getInstance().getUserDocument(null,docType?.type,
      docType?.category)
    promise.resolve(strDocuments)
  }

  @ReactMethod
  override fun scanDocument(type: Double, promise: Promise){
    val docType = BIDocType.from(type.toInt())
    if (docType == null) {
      promise.reject( "Error", "Document type not supported", null)
      return
    }
    docScanPromise = promise

    val intent = Intent( reactApplicationContext , DocumentScannerActivity::class.java).apply {
      putExtra("K_DOCUMENT_SCAN_TYPE", docType.docScannerType.value)
    }
    documentSessionResult.launch(intent)
  }

  @ReactMethod
  override fun registerNationalIDWithLiveID(
    data: ReadableMap?,
    face: String?,
    proofedBy: String?,
    promise: Promise?
  ) {
    val image = faceData(face)
    if (data != null && proofedBy != null && image != null) {
      var obj = convertReadableMapToLinkedHashMap(data)
      obj["category"] = RegisterDocCategory.identity_document.name
      obj["type"] = RegisterDocType.NATIONAL_ID.value
      registerDocument(convertReadableMapToLinkedHashMap(data), proofedBy, image, promise)
    } else {
      promise?.reject("Error", "obj, proofedBy, faceData mandatory")
      return
    }
  }

  @ReactMethod
  override fun registerDrivingLicenceWithLiveID(
    data: ReadableMap?,
    face: String?,
    proofedBy: String?,
    promise: Promise?
  ) {
    val image = faceData(face)
    if (data != null && proofedBy != null && image != null) {
      var obj = convertReadableMapToLinkedHashMap(data)
      obj["category"] = RegisterDocCategory.identity_document.name
      obj["type"] = RegisterDocType.DL.value
      registerDocument(convertReadableMapToLinkedHashMap(data), proofedBy, image, promise)
    } else {
      promise?.reject("Error", "obj, proofedBy, faceData mandatory")
      return
    }
  }

  @ReactMethod
  override fun registerPassportWithLiveID(
    data: ReadableMap?,
    face: String?,
    proofedBy: String?,
    promise: Promise?
  ) {
    val image = faceData(face)
    if (data != null && proofedBy != null && image != null) {
      var obj = convertReadableMapToLinkedHashMap(data)
      obj["category"] = RegisterDocCategory.identity_document.name
      obj["type"] = RegisterDocType.PPT.value
      registerDocument(convertReadableMapToLinkedHashMap(data), proofedBy, image, promise)
    } else {
      promise?.reject("Error", "obj, proofedBy, faceData mandatory")
      return
    }
  }

  private fun registerDocument(obj: LinkedHashMap<String, Any>, proofedBy: String, img: Bitmap, promise: Promise?) {
    BlockIDSDK.getInstance().registerDocument(activity,
      obj,
      img,
      proofedBy,
      null,
      null
    ) { p0, p1 ->
      if (p0) {
        promise?.resolve(p0)
      } else {
        promise?.reject(p1?.code?.toString() ?: "0", p1?.message ?: "")
      }
    }
  }

  private fun convertReadableMapToLinkedHashMap(readableMap: ReadableMap): LinkedHashMap<String, Any> {
    val map = LinkedHashMap<String, Any>()

    val iterator = readableMap.keySetIterator()
    while (iterator.hasNextKey()) {
      val key = iterator.nextKey()
      when (readableMap.getType(key)) {
        ReadableType.Null -> map[key] = "null"
        ReadableType.Boolean -> map[key] = readableMap.getBoolean(key)
        ReadableType.Number -> map[key] = readableMap.getDouble(key)
        ReadableType.String -> map[key] = readableMap.getString(key) ?: "null"
        ReadableType.Map -> map[key] = convertReadableMapToLinkedHashMap(readableMap.getMap(key)!!)
        ReadableType.Array -> map[key] = readableMap.getArray(key)!!.toArrayList()
        else -> throw IllegalArgumentException("Unsupported type for key: $key")
      }
    }
    return map
  }
  private fun faceData(data: String?): Bitmap? {
    if (data == null) {
      return null
    }
    return convertBase64ToBitmap(data)
  }

  private fun convertBase64ToBitmap(img: String): Bitmap? {
    if (TextUtils.isEmpty(img)) {
      return null
    }
    val decodedString = Base64.decode(img, Base64.DEFAULT)
    return BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
  }

  private  fun bidOrigin(data: ReadableMap): BIDOrigin {
    val bidOrigin = BIDOrigin()
    bidOrigin.api = data.getString("api") ?: ""
    bidOrigin.tag = data.getString("tag") ?: ""
    bidOrigin.name = data.getString("name") ?: ""
    bidOrigin.community = data.getString("community") ?: ""
    bidOrigin.publicKey = data.getString("publicKey") ?: ""
    bidOrigin.session = data.getString("session") ?: ""
    bidOrigin.authPage = data.getString("authPage") ?:  AccountAuthConstants.K_NATIVE_AUTH_SCHEMA
    return bidOrigin
  }

  fun jsonToMap(jsonObject: JSONObject): Map<String, Any?> {
    val map = mutableMapOf<String, Any?>()
    val keys = jsonObject.keys()
    while (keys.hasNext()) {
      val key = keys.next()
      val value = jsonObject.get(key)
      map[key] = when (value) {
        is JSONObject -> jsonToMap(value) // Recursive conversion for nested JSONObjects
        is org.json.JSONArray -> {
          val list = mutableListOf<Any?>()
          for (i in 0 until value.length()) {
            list.add(value.get(i))
          }
          list
        }
        else -> value
      }
    }
    return map
  }

  enum class BIDocType(val value: Int) {
    NATIONAL_ID(1),
    DRIVING_LICENCE(2),
    PASSPORT(3);

    val type: String
      get() = when (this) {
        NATIONAL_ID -> "NATIONAL_ID"
        DRIVING_LICENCE -> RegisterDocType.DL.value
        PASSPORT -> RegisterDocType.PPT.value
      }

    val docScannerType: DocumentScannerType
      get() = when (this) {
        NATIONAL_ID -> DocumentScannerType.IDCARD
        DRIVING_LICENCE -> DocumentScannerType.DL
        PASSPORT -> DocumentScannerType.PPT
      }

    val category: String
      get() = when (this) {
        else ->  BIDDocumentProvider.RegisterDocCategory.identity_document.name
      }

    companion object {
      fun from(value: Int): BIDocType? {
        return values().find { it.value == value }
      }
    }
  }

  private fun handleDocumentSessionResult(activityResult: ActivityResult) {
    if (activityResult.resultCode == Activity.RESULT_CANCELED) {
      val error: ErrorManager.ErrorResponse?
      val data = activityResult.data
      if (data != null) {
        val errorString = data.getStringExtra("K_DOCUMENT_SCAN_ERROR")
        error = BIDUtil.JSONStringToObject(errorString, ErrorManager.ErrorResponse::class.java)
        docScanPromise?.reject(error?.code?.toString() ?: "0", error?.message ?: "", null)
      } else {
        docScanPromise?.reject("0", "Document Scan Failed", null)
      }
    } else if (BIDDocumentDataHolder.hasData()) {
      docScanPromise?.resolve(BIDDocumentDataHolder.getData())
    } else {
      docScanPromise?.reject("0", "Document Scan Failed", null)
    }
  }

  enum class LiveIDResponseStatus(val raw: Int) {
    FOCUS_ON_FACE_CHANGED(0),
    FACE_LIVENESS_CHECK_STARTED(1),
    COMPLETED(2),
    FAILED(3);

    companion object {
      fun ofRaw(raw: Int): LiveIDResponseStatus? {
        return values().firstOrNull { it.raw == raw }
      }
    }
  }

  companion object {
    const val NAME = "Blockidplugin"
  }
}
