# Installing @1kosmos/react-native-blockidplugin

Step-by-step guide for consumers (partners and internal apps) to install the
plugin from the 1Kosmos JFrog npm registry.

## Prerequisites

- Node.js (v22.16.0+ recommended)
- npm (comes with Node) or yarn
- A React Native project (0.75+)
- The **client read token** (`npm-read-token`) — provided by the 1Kosmos mobile team

## Step 1 — Get the read token

The token is shared securely by the 1Kosmos team.

> ⚠️ Do NOT commit this token to source control. Keep it as an environment
> variable or in a git-ignored `.npmrc`.

## Step 2 — Export the token in your terminal

```bash
export NPM_READ_TOKEN="<YOUR_READ_TOKEN>"
```

Replace `<YOUR_READ_TOKEN>` with the actual token value you received.

Verify it's set:

```bash
echo "length: ${#NPM_READ_TOKEN}"
# Should print a number > 0
```

## Step 3 — Create `.npmrc` in your project root

Create a file called `.npmrc` at the root of your React Native project (next to
`package.json`):

```
@1kosmos:registry=https://artifactory.1kosmos.net/artifactory/api/npm/react-native-blockidplugin-local/
//artifactory.1kosmos.net/artifactory/api/npm/react-native-blockidplugin-local/:_authToken=${NPM_READ_TOKEN}
```

This routes only `@1kosmos/*` packages to the private registry. All other
dependencies (React Native, Firebase, etc.) keep resolving from public npm.

> Add `.npmrc` to your `.gitignore` so the token is never committed.

## Step 4 — Install the package

```bash
npm install @1kosmos/react-native-blockidplugin
```

or with yarn:

```bash
yarn add @1kosmos/react-native-blockidplugin
```

## Step 5 — Configure iOS (CocoaPods + SPM)

```bash
cd ios
pod install
cd ..
```

After `pod install`, Xcode will resolve BlockID SDK and its dependencies via SPM.
Open the `.xcworkspace` in Xcode and build for a physical device.

**Required Podfile settings:**

```ruby
platform :ios, '16.0'
use_frameworks! :linkage => :dynamic
```

See the main [README](./README.md) for full iOS Podfile and Xcode setup details.

## Step 6 — Configure Android

Add the BlockID SDK Maven repository to your app's `android/build.gradle` (or
`android/app/build.gradle`):

```groovy
repositories {
  maven {
    url 'https://nexus-1k-nonprod.1kosmos.net/repository/maven-releases/'
    credentials {
      username = "developer"
      password = "q5k#06ZcjSo#"
    }
  }
}
```

Ensure `minSdkVersion` is 28+. See the main [README](./README.md) for full
Android gradle and manifest setup.

## Step 7 — Use the plugin

```typescript
import { setLicenseKey } from '@1kosmos/react-native-blockidplugin';

setLicenseKey('YOUR_LICENSE_KEY').then((result) => {
  console.log('Success:', result);
});
```

## Verify installation

```bash
npm list @1kosmos/react-native-blockidplugin
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `E401 Unauthorized` | Token not set or empty | Verify `echo ${#NPM_READ_TOKEN}` > 0 in the same terminal |
| `E401` after export | Wrong token (deploy vs read) | Use the `npm-read-token`, not `npm-deploy-token` |
| `E404 Not Found` | Wrong registry URL or package not published | Check `.npmrc` URL |
| Pod install fails | Missing `use_frameworks! :linkage => :dynamic` | Add to Podfile |
| Gradle "included build not found" | `@react-native/gradle-plugin` not at expected path | See README's Android config |

## Important notes

- The token is **session-only** — close the terminal and it's gone. Re-export next time.
- `.npmrc` must be in the **same directory** where you run `npm install`.
- Only the `@1kosmos` scope routes to JFrog; everything else resolves from public npm.
