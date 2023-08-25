package com.onekosmos.blockid.reactnative.poc;

import com.androidnetworking.AndroidNetworking;
import com.androidnetworking.error.ANError;
import com.androidnetworking.interfaces.StringRequestListener;
import com.onekosmos.blockid.sdk.BIDAPIs.APIManager.ErrorManager;

/**
 * Created by 1Kosmos Engineering
 * Copyright © 2023 1Kosmos. All rights reserved.
 */
public class GetSessionDataAPI {
    private static GetSessionDataAPI sharedInstance;

    private GetSessionDataAPI() {
    }

    public static GetSessionDataAPI getInstance() {
        if (sharedInstance == null)
            sharedInstance = new GetSessionDataAPI();

        return sharedInstance;
    }

    public void getSessionData(String url, GetSessionDataCallback callback) {
        AndroidNetworking.get(url)
                .build()
                .getAsString(new StringRequestListener() {
                    @Override
                    public void onResponse(String response) {
                        callback.onSessionResponse(true, response, null);
                    }

                    @Override
                    public void onError(ANError anError) {
                        callback.onSessionResponse(false, null,
                                new ErrorManager.ErrorResponse(anError.getErrorCode(),
                                        anError.getErrorBody() != null ? anError.getErrorBody() :
                                                anError.getMessage()));
                    }
                });
    }

    interface GetSessionDataCallback {
        void onSessionResponse(boolean status, String response, ErrorManager.ErrorResponse error);
    }
}