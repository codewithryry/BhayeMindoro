import { useEffect, useState } from 'react';

import { getCacheStore } from '../lib/cache';
import { getMunicipalities } from '../lib/cache/queries';
import type { MunicipalityRow } from '../types/database';

/** Municipalities from the local cache. Empty until the cache is populated. */
export function useMunicipalities() {
  const [municipalities, setMunicipalities] = useState<MunicipalityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMunicipalities(getCacheStore())
      .then((rows) => {
        if (!cancelled) setMunicipalities(rows);
      })
      .catch((error: unknown) => {
        console.error('[Bhaye Mindoro] Failed to read municipalities from cache', error);
        if (!cancelled) setMunicipalities([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { municipalities, loading };
}
