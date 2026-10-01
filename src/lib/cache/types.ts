import type {
  FareRow,
  FareSourceRow,
  MunicipalityRow,
  RouteRow,
  TerminalRow,
  TricycleFareRow,
} from '../../types/database';

// Data flow: Supabase → local cache → UI.
// The UI reads only through a CacheStore. Reports are never cached.

export type CachedTableRows = {
  municipalities: MunicipalityRow;
  fare_sources: FareSourceRow;
  terminals: TerminalRow;
  routes: RouteRow;
  fares: FareRow;
  tricycle_fares: TricycleFareRow;
};

export type CachedTableName = keyof CachedTableRows;

/** Referenced tables first. */
export const CACHED_TABLES: readonly CachedTableName[] = [
  'municipalities',
  'fare_sources',
  'terminals',
  'routes',
  'fares',
  'tricycle_fares',
];

/**
 * Storage-agnostic cache. Implemented with IndexedDB for web and the Android
 * WebView today; a Capacitor SQLite implementation can be swapped in later
 * without touching the UI.
 */
export interface CacheStore {
  getAll<T extends CachedTableName>(table: T): Promise<CachedTableRows[T][]>;
  /** Atomically replaces every cached row of a table. */
  replaceAll<T extends CachedTableName>(
    table: T,
    rows: readonly CachedTableRows[T][],
  ): Promise<void>;
  getLastSyncedAt(table: CachedTableName): Promise<string | null>;
}
