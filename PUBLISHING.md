# Publishing @1kosmos/react-native-blockidplugin

Step-by-step guide for the mobile team to publish new versions to the 1Kosmos
JFrog Artifactory npm registry.

> **Note:** The publish script (`scripts/publish-jfrog.sh`) is bash-only.
> On Windows, use Git Bash or WSL.

## Prerequisites

- Node.js (v22.16.0+) and Yarn (3.6.1, bundled via `.yarn/releases/`)
- Access to the **publish token** (`npm-deploy-token`) from AWS Secrets Manager
- Terminal open at the **repo root** (`reactnative-blockid-demo-app/`)

## Step 1 — Get the publish token

The token lives in AWS Secrets Manager:

- **Account:** `development-workload` (`992382667796`)
- **Secret name:** `artifectory-creds-mobile-team` _(note: this is the actual name in AWS, not a typo)_
- **Key:** `npm-deploy-token`

Steps:
1. Log in to the AWS Console for `development-workload`.
2. Navigate to Secrets Manager → Secrets.
3. Open `artifectory-creds-mobile-team` → **Retrieve secret value**.
4. Copy the value of `npm-deploy-token`.

## Step 2 — Export the token in your terminal

**macOS / Linux / Git Bash:**

```bash
export JFROG_NPM_TOKEN="<paste npm-deploy-token here>"
```

**Windows PowerShell:**

```powershell
$env:JFROG_NPM_TOKEN="<paste npm-deploy-token here>"
```

Verify it's set:

**macOS / Linux / Git Bash:**

```bash
echo "length: ${#JFROG_NPM_TOKEN}"
```

**Windows PowerShell:**

```powershell
$env:JFROG_NPM_TOKEN.Length
```

> ⚠️ Do NOT hard-code this token anywhere. Do NOT commit it to source control.
> The publish script writes it to a temporary `.npmrc` that is auto-deleted.

## Step 3 — Bump the version

Edit `package.json` and increment the `version` field:

```bash
# Example: 1.30.50-dev.1 → 1.30.50-dev.2 (dev) or 1.30.50 (release)
```

> **Version immutability:** you cannot overwrite a published version. Always bump
> before publishing.

## Step 4 — Dry run (optional but recommended)

**macOS / Linux / Git Bash:**

```bash
DRY_RUN=1 yarn release:jfrog
```

**Windows:** Run from Git Bash since the script is bash-only.

This builds the library and packs a tarball without publishing. Review the output
to confirm the correct version and file count.

## Step 5 — Publish

```bash
yarn release:jfrog
```

The script will:
1. Verify you're at the repo root (errors if not).
2. Write a temporary `.npmrc` scoped to `@1kosmos` with your token.
3. Run `yarn prepare` (bob build — commonjs, module, typescript).
4. Run `npm publish` to push the package to JFrog.
5. Delete the temporary `.npmrc` (even if publish fails).

Expected output on success:

```
==> Writing temporary .npmrc (scoped to @1kosmos)
==> Building package (bob)
==> Publishing to https://artifactory.1kosmos.net/artifactory/api/npm/react-native-blockidplugin-local/
==> Publish complete.
```

## Step 6 — Verify

```bash
npm view @1kosmos/react-native-blockidplugin \
  --registry=https://artifactory.1kosmos.net/artifactory/api/npm/react-native-blockidplugin-local/
```

Should return the version you just published.

## Step 7 — Update the example app (if applicable)

If the example consumes the new version:

```bash
# Update example/package.json to reference the new version
cd example
export NPM_READ_TOKEN="<npm-read-token>"
npm install
```

## Common errors

| Error | Cause | Solution |
|-------|-------|----------|
| `ERROR: JFROG_NPM_TOKEN is not set` | Token not exported | `export JFROG_NPM_TOKEN="..."` in this terminal |
| `ERROR: run this from the repo root` | Wrong directory | `cd` to the repo root |
| `You cannot publish over the previously published versions` | Version already exists | Bump `version` in `package.json` |
| Yarn workspace error (Berry) | Ran from `example/` | Must run from repo root |

## Registry details

| Item | Value |
|------|-------|
| Registry URL | `https://artifactory.1kosmos.net/artifactory/api/npm/react-native-blockidplugin-local/` |
| Package name | `@1kosmos/react-native-blockidplugin` |
| Publish token source | AWS Secrets Manager → `artifectory-creds-mobile-team` → `npm-deploy-token` |
| Publish scope | `react-native-blockidplugin-local` only (no access to other repos) |
| Token expiry | Non-expiring, refreshable |
| Delete permission | Not granted (publish-only) |

## Token security

- Tokens are stored in AWS Secrets Manager — **never** in code or config files.
- The publish script auto-deletes the temporary `.npmrc` on exit.
- `.npmrc` is listed in `.gitignore` — even if cleanup fails, it won't be committed.
- If a token needs rotation, contact DevOps.
