import { useEffect, useState } from 'react';

import { getCacheStore } from '../lib/cache';

export type CacheStats = {
  routes: number;
  fares: number;
  tricycleFares: number;
  terminals: number;
  municipalities: number;
  lastSyncedAt: string | null;
};

/** Real row counts from the local cache — never placeholder numbers. */
export function useCacheStats() {
  const [stats, setStats] = useState<CacheStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    const store = getCacheStore();
    Promise.all([
      store.getAll('routes'),
      store.getAll('fares'),
      store.getAll('tricycle_fares'),
      store.getAll('terminals'),
      store.getAll('municipalities'),
      store.getLastSyncedAt('fares'),
    ])
      .then(([routes, fares, tricycleFares, terminals, municipalities, lastSyncedAt]) => {
        if (cancelled) return;
        setStats({
          routes: routes.filter((route) => route.active).length,
          fares: fares.length,
          tricycleFares: tricycleFares.length,
          terminals: terminals.length,
          municipalities: municipalities.length,
          lastSyncedAt,
        });
      })
      .catch((error: unknown) => {
        console.error('[Bhaye Mindoro] Failed to read cache stats', error);
        if (!cancelled) {
          setStats({
            routes: 0,
            fares: 0,
            tricycleFares: 0,
            terminals: 0,
            municipalities: 0,
            lastSyncedAt: null,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}
