# react-native-blockidplugin

A React native plugin for a BlockID - Low code authentication & identity proofing for developers. This package is created as a Turbo module with backward compatibility,
considering the old Native Module used by the legacy architecture will be deprecated once new architecture becomes stable.

## Getting Started

This project is a starting point for a React native
[plug-in package](https://github.com/1KBlockID/reactnative-blockid-demo-app),
a specialized package that includes platform-specific implementation code for
Android and/or iOS.

react-native-blockidplugin is a wrapper for the iOS and Android native BlockID SDK, designed to facilitate easy API access for React native projects. With this plugin, you can use react native code to interact with the native BlockID SDKs on both iOS and Android platforms.

For help getting started with BlockID sdk development, view the
[online documentation](https://developer.1kosmos.com/devportal/docs/), which offers guidance and a full API reference.

## Installation

**Step 1:**

Make sure your system has at least Node.js v22.16.0 installed.

```
https://nodejs.org/en/download/package-manager
```

Then install react native

```
npm install -g react-native-cli
```

make sure you have xcode and Android studio setup in your bash/zsh profiles for mac and windows respectively

we are managing dependencies via yarn, install yarn

```
npm install --global yarn
```

## How to integrate this plugin package to your React native project

**Step 1:**

Create new react native project

```
npx react-native init MyProject

or

npx @react-native-community/cli@latest init MyProject
```

in the root folder execute yarn

```
yarn
```

**Step 2:**

Install the react native blockid package as a git dependency

```
yarn add react-native-blockidplugin@https://github.com/1KBlockID/reactnative-blockid-demo-app.git#main
```

make sure you have repo access

## Configuring iOS

Go to podfile inside ios folder in your React native project and make below changes

```js
  dynamic_frameworks = ['Alamofire', 'CryptoSwift', 'BigInt', 'TrustWalletCore',
    'OpenSSL-Universal', 'PromiseKit', 'KeychainAccess', 'SwiftProtobuf', 'secp256k1.swift', 'BlockID']

    pre_install do |installer|
      installer.pod_targets.each do |pod|
        if dynamic_frameworks.include?(pod.name)
          puts "Overriding the dynamic_framework? method for #{pod.name}"
          def pod.dynamic_framework?;
            true
          end
          def pod.build_type;
            Pod::BuildType.dynamic_framework
          end
          pod.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
        end
      end
    end

  pod 'BlockID', :git => 'https://github.com/1KBlockID/ios-blockidsdk.git', :tag => '1.20.55'


    post_install do |installer|
    # https://github.com/facebook/react-native/blob/main/packages/react-native/scripts/react_native_pods.rb#L197-L202
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      # :ccache_enabled => true
    )
    installer.pods_project.targets.each do |target|
          target.build_configurations.each do |config|
             # set build active architecture to to YES
          config.build_settings['ONLY_ACTIVE_ARCH'] = 'YES'

         # enable simulator support
          config.build_settings["EXCLUDED_ARCHS[sdk=iphonesimulator*]"] = "arm64 i386"

          # set iOS Deployment Target to 15.1
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = 15.1

          if dynamic_frameworks.include?(target.name)
            config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
          end
          xcconfig_path = config.base_configuration_reference.real_path
          xcconfig = File.read(xcconfig_path)
          xcconfig_mod = xcconfig.gsub(/DT_TOOLCHAIN_DIR/, "TOOLCHAIN_DIR")
          File.open(xcconfig_path, "w") { |file| file << xcconfig_mod }
        end
      end
  end
```

and then

```
bundle install #only one time in your project
bundle exec pod install
```

Add permission in your info.plist

```
NSCameraUsageDescription, NSFaceIDUsageDescription
```

## Configuring Android:

Go to build.gradle inside android/app folder in your React project and make below changes after android{}

```
  repositories {
     google()
     mavenCentral()
     gradlePluginPortal()
     maven {
       url 'https://nexus-1k-nonprod.1kosmos.net/repository/maven-releases/'
       credentials {
         username = "developer"
         password = "q5k#06ZcjSo#"
       }
     }
     maven { url "https://jitpack.io" }
     maven {
       url 'http://www.baka.sk/maven2'
       allowInsecureProtocol = true
     }
   }
```

then Go to build.gradle inside android/app folder in your React project and make below changes

```
1. make sure minSdkVersion is 26
```

2. add packaging options in android hierarchy

```
   packagingOptions {
        exclude 'META-INF/rxjava.properties'
        exclude 'lib/x86_64/darwin/libscrypt.dylib'
        exclude 'lib/x86_64/freebsd/libscrypt.so'
        exclude 'lib/x86_64/linux/libscrypt.so'
        exclude 'META-INF/INDEX.LIST'
        exclude 'META-INF/LICENSE.md'
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/NOTICE.md'
        exclude 'AndroidManifest.xml'
    }
```

3. and then add below configurations in root level of android/app build.gradle

```
configurations.configureEach {
    exclude group: 'org.bouncycastle', module: 'bcprov-jdk15to18'
}
```

4. and Go to AndroidManifest.xml in android/app/src/debug add tools:replace="android:allowBackup,android:label,android:theme" like below

```
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    <!-- The INTERNET permission is required for development. Specifically,
         the React tool needs it to communicate with the running application
         to allow setting breakpoints, to provide hot reload, etc.
    -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:label="appname"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/LaunchTheme"
        android:allowBackup="true"
        tools:replace="android:allowBackup,android:theme,android:label"/>
</manifest>

```

Add permission in your manifest

```
camera
```

### react-native-blockidplugin usage:

Import blockidplugin in your react native project

```
import { setLicenseKey } from 'react-native-blockidplugin';
```

Example Usage

```
setLicenseKey('YOUR_LICENSE_KEY').then((result) => {
      console.log('Success: ', result);
    });
```

### BlockID developer reference:

```
https://developer.1kosmos.com/devportal/docs/
```

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
