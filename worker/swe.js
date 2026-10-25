import wasmModule from './swisseph.wasm';

// Swiss Ephemeris shipped as WebAssembly needs three shims to run in a Worker:
// Workers cannot compile wasm from bytes at runtime (so the binary is imported
// as a ready module and swapped in), the loader reads `import.meta.url` (empty
// on workerd), and it detects Node via `process`. All three are undone right
// after boot so nothing else in the isolate sees a patched runtime.
let enginePromise = null;

export function getEngine() {
  if (!enginePromise) enginePromise = boot();
  return enginePromise;
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
