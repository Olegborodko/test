#!/usr/bin/env bash
# Stage the static site into dist/ for a Sites deployment.
# Source of truth stays in the repo root: index.html, assets/, worker/.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist
mkdir -p dist/public

cp index.html dist/public/
if [ -d assets ]; then
  cp -R assets dist/public/
fi

cp worker/index.js dist/index.js

cat > dist/manifest.json <<'JSON'
{
  "entrypoint": "index.js",
  "compatibilityDate": "2026-10-25",
  "modules": [{ "name": "index.js", "type": "esm", "path": "./index.js" }],
  "assetsDirectory": "./public",
  "spa": true
}
JSON

echo "staged dist/ for deployment"
