package com.onekosmos.blockid.rectnative.poc;
import static com.onekosmos.blockid.rectnative.poc.AppConstants.defaultTenant;
import static com.onekosmos.blockid.rectnative.poc.AppConstants.dvcId;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import android.Manifest;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.onekosmos.blockid.sdk.cameramodule.camera.liveIDModule.ILiveIDResponseListener;
import com.onekosmos.blockid.sdk.cameramodule.liveID.LiveIDScannerHelper;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.google.gson.Gson;
import com.onekosmos.blockid.sdk.BIDAPIs.APIManager.ErrorManager;
import com.onekosmos.blockid.sdk.authentication.biometric.IBiometricResponseListener;
import com.onekosmos.blockid.sdk.datamodel.BIDTenant;
import com.onekosmos.blockid.sdk.BlockIDSDK;
import com.onekosmos.blockid.sdk.authentication.BIDAuthProvider;
import com.onekosmos.blockid.sdk.fido2.FIDO2KeyType;


import java.io.File;
import java.util.Objects;


public class DemoAppModule extends ReactContextBaseJavaModule implements ILiveIDResponseListener {
    private final String[] K_CAMERA_PERMISSION = new String[]{Manifest.permission.CAMERA};
    private final String errorCode = "-1";
    private final String resolveMsg = "OK";
    private String BlockIdSDKVersion = null;
    private final String K_FILE_NAME = "fido3.html";
    private final BIDTenant bidTenant = defaultTenant;
    private LiveIDScannerHelper mLiveIDScannerHelper;
    private final BIDTenant clientTenant = AppConstants.clientTenant;
    private final String licenseKey = AppConstants.licenseKey;
    ReactApplicationContext context;

    DemoAppModule(ReactApplicationContext context) {
        this.context = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "DemoAppModule";
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @ReactMethod
    public void initRegistrations(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            BlockIDSDK.getInstance().setLicenseKey(licenseKey);
        });
    }

    @ReactMethod
    public void getSDKVersion(Promise promise) {
        BlockIdSDKVersion = BlockIDSDK.getInstance().getVersion();
        promise.resolve(BlockIdSDKVersion);
    }

    @ReactMethod
    public void getSDKInfo(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            getTenantInfo(promise);
        });
    }

    @ReactMethod
    public void register_Tenant(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            initWallet(promise);
        });
    }


    @ReactMethod
    public void enrollBiometricAssets(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            if (BlockIDSDK.getInstance().isReady() && BlockIDSDK.getInstance().isDeviceAuthEnrolled()) {
                verifyBiometricData(promise);
            } else {
                enrollBiometricData(promise);
            }

        });
    }

    @ReactMethod
    public void StartLiveScan(Promise promise) {
        scanFaceId();
    }

    @ReactMethod
    public void registerUserKey(String name, Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                registerKey(name, FIDO2KeyType.PLATFORM, promise));
    }

    @ReactMethod
    public void registerCardKey(String name, Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                registerKey(name, FIDO2KeyType.CROSS_PLATFORM, promise));
    }

    @ReactMethod
    public void register(String name, Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                webRegister(name, K_FILE_NAME, promise));
    }


    public void authenticate(String name, Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                webAuthenticate(name,K_FILE_NAME, promise));
    }

    @ReactMethod
    public void authenticateUserKey(String name, Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                authenticateKey(name, FIDO2KeyType.PLATFORM, promise));
    }

    @ReactMethod
    public void authenticateCardKey(String name, Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                authenticateKey(name, FIDO2KeyType.CROSS_PLATFORM, promise));
    }

    @ReactMethod
    public void registerTenant(Promise promise) {
        UiThreadUtil.runOnUiThread(() ->
                initWallet(promise));
    }

    private void enrollBiometricData(Promise promise) {
        MainActivity activity = (MainActivity) Objects.requireNonNull(context.getCurrentActivity());
        BIDAuthProvider.getInstance().enrollDeviceAuth(activity, "Device", "Bio", true, new IBiometricResponseListener() {
            @Override
            public void onBiometricAuthResult(boolean success, ErrorManager.ErrorResponse errorResponse) {
                if (success) {
                    promise.resolve(resolveMsg);
                }
            }

            @Override
            public void onNonBiometricAuth(boolean b) {
                Log.e("onNonBiometricAuth", String.valueOf(b));

            }
        });
    }


    private void verifyBiometricData(Promise promise) {
        MainActivity activity = (MainActivity) Objects.requireNonNull(context.getCurrentActivity());
        BIDAuthProvider.getInstance().verifyDeviceAuth(activity, "Device", "Bio", true, new IBiometricResponseListener() {
            @Override
            public void onBiometricAuthResult(boolean success, ErrorManager.ErrorResponse errorResponse) {
                Log.e("onBiometricAuthResult" + success, String.valueOf(errorResponse));
                if (success) {
                    promise.resolve(resolveMsg);
                }

            }

            @Override
            public void onNonBiometricAuth(boolean b) {
                Log.e("verifyBiometricData abc", String.valueOf(b));

            }
        });
    }

    private void scanFaceId() {
        Log.d("scanFaceId call>>", "scanFaceId");
        mLiveIDScannerHelper = new LiveIDScannerHelper(context.getCurrentActivity(), this);
        mLiveIDScannerHelper.startLiveIDScanning();
    }

    private void getTenantInfo(Promise promise) {
        BIDTenant tenant = BlockIDSDK.getInstance().getTenant();
        String dns = tenant.getDns();
        String tenantTag = tenant.getTenantTag();
        String tenantId = tenant.getTenantId();
        String community = tenant.getCommunity();
        String communityId = tenant.getCommunityId();
        BIDTenant clientTenant = AppConstants.clientTenant;
        String ClientDns = clientTenant.getDns();
        String clientTenantTag = clientTenant.getTenantTag();
        String ClientTenantId = clientTenant.getTenantId();
        String ClientCommunity = clientTenant.getCommunity();
        String ClientCommunityId = clientTenant.getCommunityId();
        String newLicenseKey = licenseKey.replace(licenseKey.substring(8, licenseKey.length() - 4), "-xxxx-xxxx-xxxx-xxxxxxxx");
        String DID = BlockIDSDK.getInstance().getDID();
        String publicKey = BlockIDSDK.getInstance().getPublicKey();
        String SdkVersion = BlockIDSDK.getInstance().getVersion();
        DataModel dataModel = new DataModel();
        dataModel.setLicenseKey(newLicenseKey);
        dataModel.setTenant(tenant);
        dataModel.setClientTenant(clientTenant);
        dataModel.setDID(DID);
        dataModel.setPublicKey(publicKey);
        dataModel.setSdkVersion(SdkVersion);
        Gson gson = new Gson();
        String json = gson.toJson(dataModel);

        promise.resolve(json);

    }

    private void initWallet(Promise promise) {
        ensureSDKUnlocked();
        SharedPreferences sharedPref = Objects.requireNonNull(context.getCurrentActivity())
                .getPreferences(Context.MODE_PRIVATE);

        if (sharedPref.getBoolean(dvcId, false)) {
            BIDAuthProvider.getInstance().lockSDK();
            promise.resolve(resolveMsg);
            return;
        }
        BIDTenant bidTenant = defaultTenant;
        BlockIDSDK.getInstance().initiateWallet();


        BlockIDSDK.getInstance().registerTenant(bidTenant, (status, error, tenant) -> {
            if (!status) {
                BIDAuthProvider.getInstance().lockSDK();
                promise.reject(String.valueOf(error.getCode()), error.getMessage());
                return;
            }

            BlockIDSDK.getInstance().commitApplicationWallet();
            BIDAuthProvider.getInstance().lockSDK();
            sharedPref.edit().putBoolean(dvcId, true).apply();
            promise.resolve(resolveMsg);
        });
    }

    private void ensureSDKUnlocked() {
        if (BIDAuthProvider.getInstance().isSDKUnLocked()) {
            return;
        }
        BIDAuthProvider.getInstance().unlockSDK();
    }

    private void registerKey(String name, FIDO2KeyType type, Promise promise) {
        MainActivity activity = (MainActivity) Objects.requireNonNull(context.getCurrentActivity());
        ensureSDKUnlocked();
        BlockIDSDK.getInstance().registerFIDO2Key(
                activity,
                name,
                clientTenant.getDns(),
                clientTenant.getCommunity(),
                type,
                activity.observer,
                (status, errorResponse) -> {
                    BIDAuthProvider.getInstance().lockSDK();
                    if (errorResponse != null) {
                        promise.reject(String.valueOf(errorResponse.getCode()), errorResponse.getMessage());
                        return;
                    }
                    promise.resolve(resolveMsg);
                });
    }

    private void webRegister(String name, String fileName, Promise promise) {
        MainActivity activity = (MainActivity) Objects.requireNonNull(context.getCurrentActivity());
        ensureSDKUnlocked();
        BlockIDSDK.getInstance().registerFIDO2Key(
                activity,
                name,
                clientTenant.getDns(),
                clientTenant.getCommunity(),
                fileName,
                (status, errorResponse) -> {
                    BIDAuthProvider.getInstance().lockSDK();
                    if (errorResponse != null) {
                        promise.reject(String.valueOf(errorResponse.getCode()), errorResponse.getMessage());
                        return;
                    }

                    promise.resolve(resolveMsg);
                });
    }




    private void authenticateKey(String name, FIDO2KeyType type, Promise promise) {
        MainActivity activity = (MainActivity) Objects.requireNonNull(context.getCurrentActivity());
        ensureSDKUnlocked();

        BlockIDSDK.getInstance().authenticateFIDO2Key(
                activity,
                name,
                clientTenant.getDns(),
                clientTenant.getCommunity(),
                type,
                activity.observer,
                (status, errorResponse) -> {
                    BIDAuthProvider.getInstance().lockSDK();
                    if (errorResponse != null) {
                        promise.reject(String.valueOf(errorResponse.getCode()), errorResponse.getMessage());
                        return;
                    }
                    promise.resolve(resolveMsg);
                });
    }


    private void webAuthenticate(String name,String fileName, Promise promise) {
        MainActivity activity = (MainActivity) Objects.requireNonNull(context.getCurrentActivity());
        ensureSDKUnlocked();

        BlockIDSDK.getInstance().authenticateFIDO2Key(
                activity,
                name,
                clientTenant.getDns(),
                clientTenant.getCommunity(),
                fileName,
                activity.observer,
                (status, errorResponse) -> {
                    BIDAuthProvider.getInstance().lockSDK();
                    if (errorResponse != null) {
                        promise.reject(String.valueOf(errorResponse.getCode()), errorResponse.getMessage());
                        return;
                    }
                    promise.resolve(resolveMsg);
                });
    }


    @Override
    public void onLiveIDCaptured(Bitmap bitmap, String s, ErrorManager.ErrorResponse errorResponse) {
        Log.d("Bitmap>>", "Bitmap" + bitmap);
        WritableMap params = Arguments.createMap();
        params.putString("LiveIDResponse", errorResponse != null ? String.valueOf(errorResponse) : s);
        sendEvent(context, "onLiveIdCapture", params);
//        BlockIDSDK.getInstance().setLiveID(livIdBitmap, null, null,
//                (status, message, error) -> {

    }

    @Override
    public void onFaceFocusChanged(boolean b, String s) {
        Log.d("onFaceFocusChanged", "" + s);
    }

    @Override
    public void expressionDidReset(String s) {
        Log.d("expressionDidReset", "" + s);
    }

    @Override
    public void onLivenessCheckStarted() {
        Log.d("onLivenessCheckStarted", "onLivenessCheckStarted");
    }
}