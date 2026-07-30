#!/usr/bin/env bash
#
# Verifies the example app now consumes @1kosmos/react-native-blockidplugin
# from JFrog (npm) instead of local source.
#
# Requires the read token:
#   export NPM_READ_TOKEN="<npm-read-token>"
#   bash example/verify-npm-switch.sh
#
set -euo pipefail
cd "$(dirname "$0")"

if [[ -z "${NPM_READ_TOKEN:-}" ]]; then
  echo "ERROR: NPM_READ_TOKEN is not set." >&2
  echo '  export NPM_READ_TOKEN="<npm-read-token>"' >&2
  exit 1
fi

echo "==> Installing example dependencies (pulls plugin from JFrog)"
npm install

echo "==> Confirming plugin resolved from registry (not a local symlink)"
RESOLVED="$(node -e "console.log(require('@1kosmos/react-native-blockidplugin/package.json').version)")"
echo "    @1kosmos/react-native-blockidplugin@${RESOLVED}"

if [[ -L node_modules/@1kosmos/react-native-blockidplugin ]]; then
  echo "WARNING: plugin is a SYMLINK — still linked to local source, not npm." >&2
  exit 1
fi
echo "    OK — installed as a real dependency (not a symlink)"

echo "==> Done. Now run the app as usual:"
echo "    (iOS)     cd ios && pod install && cd .. && npm run ios"
echo "    (Android) npm run android"
