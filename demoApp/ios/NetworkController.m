#import "NetworkController.h"
#import <React/RCTHTTPRequestHandler.h>

/*
  NetworkController class
  Control over various aspects of network interaction from the app
*/
@implementation NetworkController

/*
  Allows for configuration of NSURLSessionConfiguration for the underlying NSURLSession
*/
- (void)configureSession {
  // set RCTSetCustomNSURLSessionConfigurationProvider
  RCTSetCustomNSURLSessionConfigurationProvider(^NSURLSessionConfiguration *{
     NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
     // configure the session
     // default in iOS is 4.
     [configuration setHTTPMaximumConnectionsPerHost:5];
     // max amount of time a resource request should be allowed to take
     configuration.timeoutIntervalForResource = 60.0;
     // timeout to use when waiting on additional data
     configuration.timeoutIntervalForRequest = 60.0;
     // indicates whether TCP connections should be kept open when the app moves to the background
     configuration.shouldUseExtendedBackgroundIdleMode = true;
     // indicates whether connections may use a network interface that the system considers expensive.
    if (@available(iOS 13.0, *)) {
      configuration.allowsExpensiveNetworkAccess = true;
    }
     return configuration;
  });
}


@end
