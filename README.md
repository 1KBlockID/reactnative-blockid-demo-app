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

## Publishing to the 1Kosmos JFrog registry

`@1kosmos/react-native-blockidplugin` is published to the in-house JFrog
Artifactory npm registry:

```
https://artifactory.1kosmos.net/artifactory/api/npm/react-native-blockidplugin-local/
```

There are two ways to publish.

### Automated (CI)

Pushing a version tag triggers the `Release` GitHub Actions workflow
(`.github/workflows/release.yml`), which builds and publishes automatically.

```
git tag v1.30.51
git push origin v1.30.51
```

The workflow authenticates using the `JFROG_NPM_TOKEN` repository secret, so no
token handling is needed locally.

### Manual (local machine)

Use the helper script when you need to publish from your own machine. The token
is read from an environment variable and written to a temporary `.npmrc` that is
deleted automatically afterward — it is never committed.

```bash
# 1. Export your JFrog publish token (do NOT hard-code it anywhere)
export JFROG_NPM_TOKEN="<your-publish-token>"

# 2a. Dry run — builds and packs the tarball, does not publish
DRY_RUN=1 yarn release:jfrog

# 2b. Real publish — builds and publishes the current version
yarn release:jfrog
```

Bump the version in `package.json` before publishing a new release (or use
`yarn release` which drives the version via conventional commits).

> `.npmrc` is git-ignored. Never commit a file containing the token.

### Getting the tokens (AWS Secrets Manager)

The Artifactory tokens are **not** stored in this repo. Retrieve them from AWS
Secrets Manager:

- **Account:** `development-workload` (`992382667796`)
- **Secret:** `artifectory-creds-mobile-team`

| Secret key | Purpose | Who uses it |
|------------|---------|-------------|
| `npm-deploy-token` | Publish (read + write) to `react-native-blockidplugin-local` | Mobile team — publishing |
| `npm-read-token` | Read-only on `react-native-blockidplugin-local` | Clients — installing |

To retrieve: AWS Console → Secrets Manager → open `artifectory-creds-mobile-team`
→ **Retrieve secret value**.

### GitHub Actions setup (one-time)

For the CI release workflow to publish, add the publish token as a repository
secret:

- Secret name: **`JFROG_NPM_TOKEN`**
- Value: the `npm-deploy-token` value from AWS Secrets Manager

The same token works for the manual CLI flow — export it as `JFROG_NPM_TOKEN`
before running `yarn release:jfrog`.

### Verify a publish

```bash
npm view @1kosmos/react-native-blockidplugin \
  --registry=https://artifactory.1kosmos.net/artifactory/api/npm/react-native-blockidplugin-local/
```

> **Version immutability:** once a version is published it cannot be overwritten.
> Always bump the version in `package.json` before publishing.

### Registry architecture (FYI)

DevOps provisioned three repositories behind the scenes:

| Repository | Type | Purpose |
|------------|------|---------|
| `react-native-blockidplugin-local` | Local | Source of truth for published `@1kosmos/*` packages |
| `npm-remote` | Remote | Proxy/cache for public npm (`registry.npmjs.org`) |
| `react-native-blockidplugin-virtual` | Virtual | Single endpoint aggregating local + remote |

### Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid/expired token | Verify the token; contact DevOps to rotate |
| `403 Forbidden` | Token lacks permission | Use the correct token (publish vs read) |
| `You cannot publish over the previously published versions` | Version already exists | Bump the version in `package.json` |
| `E404 Not Found` | Not published yet / wrong registry URL | Check `.npmrc` registry URL and package name |

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

Install the react native blockid package.

### Option A — Install from the 1Kosmos npm registry (recommended)

`@1kosmos/react-native-blockidplugin` is published to the in-house JFrog Artifactory
npm registry. Add a `.npmrc` at the root of your project that routes the `@1kosmos`
scope to the registry (all other dependencies keep resolving from public npm):

```
# .npmrc
@1kosmos:registry=https://artifactory.1kosmos.net/artifactory/api/npm/react-native-blockidplugin-local/
//artifactory.1kosmos.net/artifactory/api/npm/react-native-blockidplugin-local/:_authToken=<CLIENT_READ_TOKEN>
```

Use the **`npm-read-token`** (client read token) here — provided by the 1Kosmos
team. Then install:

```
npm install @1kosmos/react-native-blockidplugin
# or
yarn add @1kosmos/react-native-blockidplugin
```

Update the import to use the scoped name:

```
import { setLicenseKey } from '@1kosmos/react-native-blockidplugin';
```

### Option B — Install as a git dependency (legacy, still supported)

```
yarn add react-native-blockidplugin@https://github.com/1KBlockID/reactnative-blockid-demo-app.git#main
```

make sure you have repo access

## Configuring iOS

BlockID SDK (1.30.40+) is distributed exclusively via Swift Package Manager (SPM). The plugin's podspec uses React Native's `spm_dependency` helper (available since RN 0.75) to automatically resolve BlockID and its transitive dependencies via SPM during `pod install`.

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

Then run:

```bash
cd ios
pod install
```

After `pod install`, you should see SPM logs confirming BlockID and its dependencies (Alamofire, BigInt, CryptoSwift, OpenSSL, WalletCore) are added to the Pods project.

**First Xcode build:**

Open the `.xcworkspace` file in Xcode. On first open, Xcode will resolve SPM packages (this may take a minute). Then build for a physical device (Cmd+B).

Note: BlockID SDK does not support iOS Simulator — you must build and run on a physical device.

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
       url 'https://artifactory.1kosmos.net/artifactory/maven-releases-local/'
       credentials {
        username = 'developer'
        password = 'xK9#mPw2$vLq7nBz!'
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
