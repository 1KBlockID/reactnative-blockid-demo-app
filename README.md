# @1kosmos/react-native-blockidplugin

A React Native plugin for BlockID — low-code authentication & identity proofing for developers. This package is created as a Turbo module with backward compatibility,
considering the old Native Module used by the legacy architecture will be deprecated once new architecture becomes stable.

## Overview

`@1kosmos/react-native-blockidplugin` is a wrapper for the iOS and Android native BlockID SDK, designed to facilitate easy API access for React Native projects. With this plugin, you can use React Native code to interact with the native BlockID SDKs on both iOS and Android platforms.

For help getting started with BlockID SDK development, view the
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

### Prerequisites

- Node.js (v22.16.0+ recommended)
- npm or yarn
- A React Native project (0.75+)
- The **client read token** (`npm-read-token`) — provided by the 1Kosmos mobile team

### Step 1 — Get the read token

The token is shared securely by the 1Kosmos mobile team. Contact your 1Kosmos representative if you don't have one.

> ⚠️ Do NOT commit this token to source control. Keep it as an environment
> variable or in a git-ignored `.npmrc`.

### Step 2 — Set the token in your terminal

**macOS / Linux:**

```bash
export NPM_READ_TOKEN="eyJ2ZXIiOiIyIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYiLCJraWQiOiJEMnFRSHYyRlZPVmVMNnZtLUJJckJjb1BKaHVxWkR5REZlc3ViWDBRbTdzIn0.eyJzdWIiOiJqZnJ0QDAxaHo3NW5iODNqYzVhMDFlZmp3eTIwa2JkL3VzZXJzL3N2Yy1ucG0tY2xpZW50LXJlYWQiLCJzY3AiOiJtZW1iZXItb2YtZ3JvdXBzOm5wbS1jbGllbnQtcmVhZGVycyIsImF1ZCI6ImpmcnRAMDFoejc1bmI4M2pjNWEwMWVmand5MjBrYmQiLCJpc3MiOiJqZnJ0QDAxaHo3NW5iODNqYzVhMDFlZmp3eTIwa2JkL3VzZXJzL2F0dWwucGFuZGV5IiwiaWF0IjoxNzgzNTg5MTUyLCJqdGkiOiJkOWQ4ZjIxNi1jZGZlLTRlY2ItOWU2MS05NTYwNTZiNGVjZDkifQ.kpNiMuh7ZV7GPwhMTUXCRaWHPIjHFpZEnk0T6IkgamXb7nGEehB5FFdrfO8c504HDbAi0zkf7I5nntGUBSaPl5osO3IrVgxYju6Jhc8kP0MP05PYZtSxIgJDiWooqN8wKszlKTmm73Lp8Mn4dGUYAKi4X0TN8brzHzbel4wcfRA7cp1Am6APRzoaqpWNofZ9h6Su4r3T5Dfn6A6a-t_Rxe1CXQZS9uNdR8uogx_Fdd9TSrNb2rIzjYlOwzOsCGB5oku6vq5Oxx_g2A2rN2a66RCWLg76PTtobELTN1hcPV3zYsaaXSopmVDaulICxhkNp1JFAztaCnNqncQ0NXc3_A"
```

**Windows PowerShell:**

```powershell
$env:NPM_READ_TOKEN="eyJ2ZXIiOiIyIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYiLCJraWQiOiJEMnFRSHYyRlZPVmVMNnZtLUJJckJjb1BKaHVxWkR5REZlc3ViWDBRbTdzIn0.eyJzdWIiOiJqZnJ0QDAxaHo3NW5iODNqYzVhMDFlZmp3eTIwa2JkL3VzZXJzL3N2Yy1ucG0tY2xpZW50LXJlYWQiLCJzY3AiOiJtZW1iZXItb2YtZ3JvdXBzOm5wbS1jbGllbnQtcmVhZGVycyIsImF1ZCI6ImpmcnRAMDFoejc1bmI4M2pjNWEwMWVmand5MjBrYmQiLCJpc3MiOiJqZnJ0QDAxaHo3NW5iODNqYzVhMDFlZmp3eTIwa2JkL3VzZXJzL2F0dWwucGFuZGV5IiwiaWF0IjoxNzgzNTg5MTUyLCJqdGkiOiJkOWQ4ZjIxNi1jZGZlLTRlY2ItOWU2MS05NTYwNTZiNGVjZDkifQ.kpNiMuh7ZV7GPwhMTUXCRaWHPIjHFpZEnk0T6IkgamXb7nGEehB5FFdrfO8c504HDbAi0zkf7I5nntGUBSaPl5osO3IrVgxYju6Jhc8kP0MP05PYZtSxIgJDiWooqN8wKszlKTmm73Lp8Mn4dGUYAKi4X0TN8brzHzbel4wcfRA7cp1Am6APRzoaqpWNofZ9h6Su4r3T5Dfn6A6a-t_Rxe1CXQZS9uNdR8uogx_Fdd9TSrNb2rIzjYlOwzOsCGB5oku6vq5Oxx_g2A2rN2a66RCWLg76PTtobELTN1hcPV3zYsaaXSopmVDaulICxhkNp1JFAztaCnNqncQ0NXc3_A"
```

Verify it's set:

**macOS / Linux:**

```bash
echo "length: ${#NPM_READ_TOKEN}"
```

**Windows PowerShell:**

```powershell
$env:NPM_READ_TOKEN.Length
```

Should print a number > 0.

### Step 3 — Create `.npmrc` in your project root

Create a file called `.npmrc` at the root of your React Native project (next to `package.json`):

```
@1kosmos:registry=https://artifactory.1kosmos.net/artifactory/api/npm/react-native-blockidplugin-local/
//artifactory.1kosmos.net/artifactory/api/npm/react-native-blockidplugin-local/:_authToken=${NPM_READ_TOKEN}
```

This routes only `@1kosmos/*` packages to the private registry. All other
dependencies (React Native, Firebase, etc.) keep resolving from public npm.

> Add `.npmrc` to your `.gitignore` so the token is never committed.

### Step 4 — Install the package

```bash
npm install @1kosmos/react-native-blockidplugin
```

or with yarn:

```bash
yarn add @1kosmos/react-native-blockidplugin
```

### Step 5 — Verify installation

```bash
npm list @1kosmos/react-native-blockidplugin
```

Should show the installed version (e.g., `@1kosmos/react-native-blockidplugin@1.30.52`).

## Configuring iOS

BlockID SDK (1.30.40+) is distributed exclusively via Swift Package Manager (SPM). The plugin's podspec uses React Native's `spm_dependency` helper (available since RN 0.75) to automatically resolve BlockID and its transitive dependencies via SPM during `pod install`.

### Podfile setup

Add `use_frameworks! :linkage => :dynamic` to your Podfile. This is required for SPM dependencies to work with CocoaPods.

```ruby
platform :ios, '16.0'

# Required for BlockID SDK (SPM-based dependency)
use_frameworks! :linkage => :dynamic

target 'YourApp' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    :fabric_enabled => true,
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
        config.build_settings['ONLY_ACTIVE_ARCH'] = 'YES' if config.name == 'Debug'
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '16.0'
        xcconfig_path = config.base_configuration_reference.real_path
        xcconfig = File.read(xcconfig_path)
        xcconfig_mod = xcconfig.gsub(/DT_TOOLCHAIN_DIR/, "TOOLCHAIN_DIR")
        File.open(xcconfig_path, "w") { |file| file << xcconfig_mod }
      end
    end
  end
end
```

### Run pod install

```bash
cd ios
pod install
cd ..
```

After `pod install`, you should see SPM logs confirming BlockID and its dependencies (Alamofire, BigInt, CryptoSwift, OpenSSL, WalletCore) are added to the Pods project.

### First Xcode build

Open the `.xcworkspace` file in Xcode. On first open, Xcode will resolve SPM packages (this may take a minute). Then build for a physical device (Cmd+B).

Note: Simulator builds are supported from BlockID SDK v1.30.50+. Earlier versions require a physical device.

### Linking SPM packages to your app target

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

### Info.plist permissions

```
NSCameraUsageDescription
NSFaceIDUsageDescription
```

## Configuring Android

### Step 1 — Add Maven repository

Go to `android/app/build.gradle` and add the BlockID SDK Maven repository:

```groovy
repositories {
  google()
  mavenCentral()
  gradlePluginPortal()
  maven {
    url 'https://artifactory.1kosmos.net/artifactory/maven-releases-local/'
    credentials {
      username = 'developer'
      password = 'xK9#mPw2$vLq7nBz!'
    }
  }
  maven { url "https://jitpack.io" }
}
```

### Step 2 — Set minSdkVersion

Ensure `minSdkVersion` is 28+ in your `android/app/build.gradle`.

### Step 3 — Add packaging options

Add inside `android {}` block:

```groovy
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

### Step 4 — Exclude BouncyCastle conflict

Add at root level of `android/app/build.gradle`:

```groovy
configurations.configureEach {
  exclude group: 'org.bouncycastle', module: 'bcprov-jdk15to18'
}
```

### Step 5 — Update AndroidManifest.xml

In `android/app/src/debug/AndroidManifest.xml`, add `tools:replace`:

```xml
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

## Usage

```typescript
import { setLicenseKey } from '@1kosmos/react-native-blockidplugin';

setLicenseKey('YOUR_LICENSE_KEY').then((result) => {
  console.log('Success:', result);
});
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `E401 Unauthorized` | Token not set or empty | Verify token is set in your terminal |
| `E401` after export | Wrong token (deploy vs read) | Use the `npm-read-token`, not `npm-deploy-token` |
| `E404 Not Found` | Wrong registry URL or package not published | Check `.npmrc` URL matches the one above |
| Pod install fails | Missing `use_frameworks!` | Add `use_frameworks! :linkage => :dynamic` to Podfile |
| Gradle "included build not found" | `@react-native/gradle-plugin` not at expected path | See Android config above |
| `dyld` crash on iOS launch | SPM frameworks not linked | See "Linking SPM packages" section above |

## Important notes

- The read token is **session-only** — close the terminal and it's gone. Re-export next time.
- `.npmrc` must be in the **same directory** where you run `npm install`.
- Only the `@1kosmos` scope routes to JFrog; everything else resolves from public npm.

## API Reference

Full API documentation: https://developer.1kosmos.com/devportal/docs/

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
