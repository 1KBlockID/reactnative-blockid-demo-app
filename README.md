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

## Requirements

| Platform | Minimum Version |
|----------|----------------|
| iOS | 16.0 |
| Android | API 28 (Android 9) |
| React Native | 0.75+ |
| Xcode | 16+ |
| Node.js | 22.16.0+ |

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

BlockID SDK (1.30.61+) is distributed exclusively via Swift Package Manager (SPM). The plugin's podspec uses React Native's `spm_dependency` helper (available since RN 0.75) to automatically resolve BlockID and its transitive dependencies via SPM during `pod install`.

**Podfile setup:**

Add `use_frameworks! :linkage => :dynamic` to your Podfile. This is required for SPM dependencies to work with CocoaPods.

```ruby
platform :ios, '16.0'

# Required for BlockID SDK (SPM-based dependency)
use_frameworks! :linkage => :dynamic

target 'YourApp' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
    )

    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '16.0'
      end
    end
  end
end
```

Then run:

```bash
cd ios
pod install
```

After `pod install`, you should see SPM logs confirming BlockID and its dependencies (Alamofire, BigInt, CryptoSwift, OpenSSL, WalletCore) are added to the Pods project.

**First Xcode build:**

Open the `.xcworkspace` file in Xcode. On first open, Xcode will resolve SPM packages (this may take a minute). Then build for a physical device (Cmd+B).

**Important — Linking SPM packages to your app target:**

After `pod install`, you need to add the SPM packages to your app target so they are embedded in the app bundle at runtime. In Xcode:

1. Select your app target → General → Frameworks, Libraries, and Embedded Content
2. Click "+" and add these packages (they should appear under "Pods" workspace packages):
   - BlockID
   - Alamofire
   - BigInt
   - CryptoSwift
   - OpenSSL
   - WalletCore

Alternatively, add the post_install script from the example app's Podfile which does this programmatically.

Without this step, the app will crash on launch with a `dyld` error (missing dynamic frameworks).

**Info.plist permissions:**

```
NSCameraUsageDescription
NSFaceIDUsageDescription
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
   }
```

then Go to build.gradle inside android/app folder in your React project and make below changes

```
1. make sure minSdkVersion is 28
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
