import { createIndexedDbStore } from './indexedDbStore';
import type { CacheStore } from './types';

export * from './types';

let store: CacheStore | null = null;

/**
 * The app's local cache. IndexedDB works in browsers and in the Capacitor
 * Android WebView. To move Android to Capacitor SQLite later, return a
 * SQLite-backed CacheStore here when Capacitor.isNativePlatform() is true.
 */
export function getCacheStore(): CacheStore {
  return (store ??= createIndexedDbStore());
}
