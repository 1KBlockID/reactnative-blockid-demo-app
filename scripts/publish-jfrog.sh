#!/usr/bin/env bash
#
# Manual publish of @1kosmos/react-native-blockidplugin to the in-house
# JFrog Artifactory npm registry.
#
# The auth token is read from the JFROG_NPM_TOKEN environment variable and
# written to a TEMPORARY .npmrc that is removed on exit. The token is never
# written to a committed file.
#
# Usage:
#   export JFROG_NPM_TOKEN="<your-publish-token>"
#   yarn release:jfrog            # build + publish current version
#   DRY_RUN=1 yarn release:jfrog  # build + pack only, no publish
#
set -euo pipefail

# This script publishes the LIBRARY and must run from the repo root, not from
# example/ (which is a separate npm-managed app). Running yarn from example/
# triggers a Yarn Berry workspace-resolution error.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
if [[ "$(pwd)" != "${REPO_ROOT}" ]]; then
  echo "ERROR: run this from the repo root, not $(pwd)" >&2
  echo "  cd ${REPO_ROOT} && yarn release:jfrog" >&2
  exit 1
fi

REGISTRY_HOST="artifactory.1kosmos.net"
REGISTRY_PATH="/artifactory/api/npm/react-native-blockidplugin-local/"
REGISTRY_URL="https://${REGISTRY_HOST}${REGISTRY_PATH}"
NPMRC_FILE="$(pwd)/.npmrc"

if [[ -z "${JFROG_NPM_TOKEN:-}" ]]; then
  echo "ERROR: JFROG_NPM_TOKEN is not set." >&2
  echo "  export JFROG_NPM_TOKEN=\"<your-publish-token>\"" >&2
  exit 1
fi

# Clean up the generated .npmrc no matter how the script exits.
cleanup() {
  rm -f "${NPMRC_FILE}"
}
trap cleanup EXIT

echo "==> Writing temporary .npmrc (scoped to @1kosmos)"
{
  echo "@1kosmos:registry=${REGISTRY_URL}"
  echo "//${REGISTRY_HOST}${REGISTRY_PATH}:_authToken=${JFROG_NPM_TOKEN}"
} > "${NPMRC_FILE}"

echo "==> Building package (bob)"
yarn prepare

if [[ "${DRY_RUN:-0}" == "1" ]]; then
  echo "==> DRY_RUN=1 set — packing only, not publishing"
  npm pack --ignore-scripts
  echo "==> Dry run complete. Tarball written to current directory."
  exit 0
fi

echo "==> Publishing to ${REGISTRY_URL}"

# Detect prerelease versions (contain a hyphen after the patch, e.g. 1.30.50-dev.1)
# and tag them as "dev" so they don't override the "latest" dist-tag for partners.
CURRENT_VERSION=$(node -e "console.log(require('./package.json').version)")
if [[ "${CURRENT_VERSION}" == *-* ]]; then
  echo "    (prerelease detected: ${CURRENT_VERSION} → tagging as 'dev')"
  npm publish --ignore-scripts --tag dev
else
  npm publish --ignore-scripts --tag latest
fi

echo "==> Publish complete."
