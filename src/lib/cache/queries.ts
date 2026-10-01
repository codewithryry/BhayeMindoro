import type { FareSourceRow, MunicipalityRow, TricycleFareRow } from '../../types/database';
import type { CacheStore } from './types';

// Read helpers over the local cache. Screens use these, never Supabase directly.

export async function getMunicipalities(store: CacheStore): Promise<MunicipalityRow[]> {
  const rows = await store.getAll('municipalities');
  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

const normalize = (value: string) => value.trim().toLowerCase();

/** Latest tricycle fare matching origin/destination (case-insensitive, either direction). */
export async function findTricycleFare(
  store: CacheStore,
  municipalityId: string,
  origin: string,
  destination: string,
): Promise<TricycleFareRow | null> {
  const from = normalize(origin);
  const to = normalize(destination);
  const matches = (await store.getAll('tricycle_fares')).filter((fare) => {
    if (fare.municipality_id !== municipalityId) return false;
    const o = normalize(fare.origin);
    const d = normalize(fare.destination);
    return (o === from && d === to) || (o === to && d === from);
  });
  matches.sort((a, b) => b.effective_date.localeCompare(a.effective_date));
  return matches[0] ?? null;
}

export async function getFareSource(store: CacheStore, id: string): Promise<FareSourceRow | null> {
  const sources = await store.getAll('fare_sources');
  return sources.find((source) => source.id === id) ?? null;
}
