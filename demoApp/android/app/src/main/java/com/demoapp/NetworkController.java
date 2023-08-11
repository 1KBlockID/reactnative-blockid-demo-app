package com.onekosmos.blockid.reactnative.poc;

import com.facebook.react.modules.network.NetworkingModule;

import java.util.concurrent.TimeUnit;

import okhttp3.ConnectionPool;


/**
 * Created by 1Kosmos Engineering
 * Copyright © 2023 1Kosmos. All rights reserved.
 */

public class NetworkController {

    /*
        Allows for configuration using NetworkingModule
    */
    public static void ConfigureSession() {
        NetworkingModule.setCustomClientBuilder(
                builder -> {
                    builder.build()
                            .connectionPool().evictAll();
                    builder
                            .connectionPool(new ConnectionPool(10, 3, TimeUnit.SECONDS))
                            .retryOnConnectionFailure(false)
                            .connectTimeout(3, TimeUnit.SECONDS);
                }
        );

    }
}
