package com.demoapp;

import com.facebook.react.modules.network.NetworkingModule;
import java.util.concurrent.TimeUnit;
import okhttp3.ConnectionPool;

/*
  NetworkController class
  Control over various aspects of network interaction from the app
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
