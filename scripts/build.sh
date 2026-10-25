#!/usr/bin/env bash
# Stage the site and the Worker bundle for deployment.
# Source of truth stays in the repo root: index.html, assets/, worker/.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist
mkdir -p dist/public

# Static assets.
cp index.html dist/public/
if [ -d assets ]; then
  cp -R assets dist/public/
fi

# The WebAssembly build of Swiss Ephemeris is imported as a compiled module, so
# the binary has to exist next to the Worker source before bundling.
cp node_modules/@kuntay/swisseph/wasm/swisseph.wasm worker/swisseph.wasm

# Bundle Worker + dependencies with wrangler, which knows how to keep a .wasm
# import as a separate module for the platform.
npx wrangler deploy --dry-run --outdir dist/bundle >/dev/null

mv dist/bundle/index.js dist/index.js
mv dist/bundle/*.wasm dist/swisseph.wasm
rm -rf dist/bundle

# Name the wasm module the way the bundle imports it.
python3 - <<'PY'
import json
import pathlib
import re

dist = pathlib.Path('dist')
bundle = (dist / 'index.js').read_text()
modules = [{'name': 'index.js', 'type': 'esm', 'path': './index.js'}]

for specifier in sorted(set(re.findall(r'from\s*"(\./[^"]+\.wasm)"', bundle))):
    bundle = bundle.replace(specifier, './swisseph.wasm')
    modules.append({'name': 'swisseph.wasm', 'type': 'wasm', 'path': './swisseph.wasm'})

(dist / 'index.js').write_text(bundle)
manifest = {
    'entrypoint': 'index.js',
    'compatibilityDate': '2026-10-25',
    'modules': modules,
    'assetsDirectory': './public',
    'spa': True,
}
(dist / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('staged dist/ for deployment')
PY
