import { getSupabase } from '../supabase';
import { CACHED_TABLES, type CacheStore, type CachedTableName } from './types';

// Foundation only: a full-table pull per table. Not yet wired into the app.
// Still to do: delta sync by updated_at, scheduling, connectivity checks,
// and pagination past the PostgREST row limit.

export type PullResult = { table: CachedTableName; rowCount: number };

export async function pullTable(store: CacheStore, table: CachedTableName): Promise<PullResult> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    throw new Error(`Failed to pull ${table}: ${error.message}`);
  }
  await store.replaceAll(table, data);
  return { table, rowCount: data.length };
}

/**
 * Refreshes every cached table. Each table is replaced atomically, so a failed
 * pull keeps the previously cached data and the app keeps working offline.
 */
export async function pullAllTransportData(store: CacheStore): Promise<PullResult[]> {
  const results: PullResult[] = [];
  for (const table of CACHED_TABLES) {
    results.push(await pullTable(store, table));
  }
  return results;
}
