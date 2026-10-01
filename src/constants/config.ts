export const APP_NAME = 'Bhaye Mindoro';

// Only VITE_* variables are bundled into the app (and are public).
// Never put a Supabase service-role key here.
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

/** IndexedDB database used as the local transportation-data cache. */
export const LOCAL_DB_NAME = 'bhaye-mindoro';

export const CURRENCY = 'PHP';

/** Statutory discount for students, senior citizens, and PWDs (RA 11314, RA 9994, RA 10754). */
export const SPECIAL_DISCOUNT_RATE = 0.2;

export const FARE_DISCLAIMER =
  'Gabay lamang ang fare. Sundin ang official na taripa ng LGU o transport operator.';
