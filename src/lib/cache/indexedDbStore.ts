import { LOCAL_DB_NAME } from '../../constants/config';
import {
  CACHED_TABLES,
  type CacheStore,
  type CachedTableName,
  type CachedTableRows,
} from './types';

// Bump when object stores change, and handle the upgrade in onupgradeneeded.
const DB_VERSION = 1;
const META_STORE = 'cache_meta';

type MetaRecord = { table: CachedTableName; lastSyncedAt: string };

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available'));
      return;
    }
    const request = indexedDB.open(LOCAL_DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const table of CACHED_TABLES) {
        if (!db.objectStoreNames.contains(table)) {
          db.createObjectStore(table, { keyPath: 'id' });
        }
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'table' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function createIndexedDbStore(): CacheStore {
  let dbPromise: Promise<IDBDatabase> | null = null;
  const db = () => (dbPromise ??= openDatabase());

  return {
    async getAll<T extends CachedTableName>(table: T) {
      const tx = (await db()).transaction(table, 'readonly');
      return promisify(tx.objectStore(table).getAll() as IDBRequest<CachedTableRows[T][]>);
    },

    async replaceAll<T extends CachedTableName>(table: T, rows: readonly CachedTableRows[T][]) {
      const tx = (await db()).transaction([table, META_STORE], 'readwrite');
      const store = tx.objectStore(table);
      store.clear();
      for (const row of rows) store.put(row);
      const meta: MetaRecord = { table, lastSyncedAt: new Date().toISOString() };
      tx.objectStore(META_STORE).put(meta);
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    },

    async getLastSyncedAt(table: CachedTableName) {
      const tx = (await db()).transaction(META_STORE, 'readonly');
      const meta = await promisify(
        tx.objectStore(META_STORE).get(table) as IDBRequest<MetaRecord | undefined>,
      );
      return meta?.lastSyncedAt ?? null;
    },
  };
}
