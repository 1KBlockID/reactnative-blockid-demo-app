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
export NPM_READ_TOKEN="eyJ2ZXIiOiIyIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYiLCJraWQiOiJEMnFRSHYyRlZPVmVMNnZtLUJJckJjb1BKaHVxWkR5REZlc3ViWDBRbTdzIn0.eyJzdWIiOiJqZnJ0QDAxaHo3NW5iODNqYzVhMDFlZmp3eTIwa2JkL3VzZXJzL3N2Yy1ucG0tY2xpZW50LXJlYWQiLCJzY3AiOiJtZW1iZXItb2YtZ3JvdXBzOm5wbS1jbGllbnQtcmVhZGVycyIsImF1ZCI6ImpmcnRAMDFoejc1bmI4M2pjNWEwMWVmand5MjBrYmQiLCJpc3MiOiJqZnJ0QDAxaHo3NW5iODNqYzVhMDFlZmp3eTIwa2JkL3VzZXJzL2F0dWwucGFuZGV5IiwiaWF0IjoxNzgzNTg5MTUyLCJqdGkiOiJkOWQ4ZjIxNi1jZGZlLTRlY2ItOWU2MS05NTYwNTZiNGVjZDkifQ.kpNiMuh7ZV7GPwhMTUXCRaWHPIjHFpZEnk0T6IkgamXb7nGEehB5FFdrfO8c504HDbAi0zkf7I5nntGUBSaPl5osO3IrVgxYju6Jhc8kP0MP05PYZtSxIgJDiWooqN8wKszlKTmm73Lp8Mn4dGUYAKi4X0TN8brzHzbel4wcfRA7cp1Am6APRzoaqpWNofZ9h6Su4r3T5Dfn6A6a-t_Rxe1CXQZS9uNdR8uogx_Fdd9TSrNb2rIzjYlOwzOsCGB5oku6vq5Oxx_g2A2rN2a66RCWLg76PTtobELTN1hcPV3zYsaaXSopmVDaulICxhkNp1JFAztaCnNqncQ0NXc3_A"
```

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
