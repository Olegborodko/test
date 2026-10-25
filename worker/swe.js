import wasmModule from './swisseph.wasm';

// Swiss Ephemeris shipped as WebAssembly needs three shims to run in a Worker:
// Workers cannot compile wasm from bytes at runtime (so the binary is imported
// as a ready module and swapped in), the loader reads `import.meta.url` (empty
// on workerd), and it detects Node via `process`. All three are undone right
// after boot so nothing else in the isolate sees a patched runtime.
let enginePromise = null;
let precisionPromise = null;
let precisionReady = false;

// The full ephemeris derived from JPL DE441, sliced for 1800-2399. Without these
// files the engine uses its built-in Moshier theory, which differs from DE441 by
// under an arcsecond but is not the reference itself.
const PRECISION_FILES = ['sepl_18.se1', 'semo_18.se1'];

export function getEngine() {
  if (!enginePromise) enginePromise = boot();
  return enginePromise;
}

/** True once the DE441-derived files are mounted in this isolate. */
export function isPrecisionReady() {
  return precisionReady;
}

/**
 * Fetches the ephemeris files from the site's own assets and mounts them. Runs
 * in the background: the first request of an isolate is answered with Moshier,
 * and later ones use the full ephemeris. A failure is not fatal, the engine
 * simply keeps using Moshier.
 */
export function loadPrecisionFiles(assets) {
  if (!precisionPromise) {
    precisionPromise = (async () => {
      try {
        const { MemoryEphemeris } = await import('@kuntay/swisseph');
        const responses = await Promise.all(
          PRECISION_FILES.map((name) => assets.fetch(`https://assets.internal/ephe/${name}`)),
        );
        if (responses.some((response) => !response.ok)) throw new Error('ephemeris asset missing');

        const files = {};
        for (let index = 0; index < PRECISION_FILES.length; index += 1) {
          files[PRECISION_FILES[index]] = new Uint8Array(await responses[index].arrayBuffer());
        }

        const { swe } = await getEngine();
        const result = await swe.loadEphemeris(new MemoryEphemeris(files), {
          fromYear: 1800,
          toYear: 2399,
          kinds: ['planets', 'moon'],
        });
        precisionReady = result.missing.length === 0 && result.loaded.length > 0;
        return precisionReady;
      } catch {
        precisionPromise = null;
        return false;
      }
    })();
  }
  return precisionPromise;
}

async function boot() {
  const RealURL = globalThis.URL;
  const realInstantiate = WebAssembly.instantiate;
  const realFetch = globalThis.fetch;
  const realProcess = globalThis.process;

  function PatchedURL(path, base) {
    try {
      return new RealURL(path, base);
    } catch {
      return { href: String(path) };
    }
  }
  PatchedURL.prototype = RealURL.prototype;
  PatchedURL.canParse = RealURL.canParse;
  globalThis.URL = PatchedURL;

  WebAssembly.instantiate = (binary, imports) => {
    const module = binary instanceof WebAssembly.Module ? binary : wasmModule;
    return realInstantiate(module, imports).then((instance) => ({ module, instance }));
  };

  globalThis.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : (input && input.url) || String(input);
    if (url.endsWith('swisseph.wasm')) {
      return Promise.resolve(new Response(new Uint8Array(0), { headers: { 'content-type': 'application/wasm' } }));
    }
    return realFetch(input, init);
  };

  try {
    delete globalThis.process;
  } catch {
    // Non-configurable in some runtimes; the web path is taken anyway.
  }

  try {
    const mod = await import('@kuntay/swisseph');
    const swe = await mod.createSwissEph();
    return { swe, mod };
  } finally {
    globalThis.URL = RealURL;
    WebAssembly.instantiate = realInstantiate;
    globalThis.fetch = realFetch;
    if (realProcess !== undefined) globalThis.process = realProcess;
  }
}
