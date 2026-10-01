import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../constants/config';
import type { Database } from '../types/database';

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = isValidUrl(SUPABASE_URL) && SUPABASE_ANON_KEY.length > 0;

let client: SupabaseClient<Database> | null = null;
let warned = false;

/**
 * Supabase client, created lazily on first use. Returns null when
 * Supabase is not configured, so callers can degrade gracefully instead of
 * crashing the app. Access is governed entirely by Row Level Security.
 */
export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) {
    if (import.meta.env.DEV && !warned) {
      warned = true;
      console.warn(
        '[Bhaye Mindoro] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.',
      );
    }
    return null;
  }
  if (!client) {
    try {
      client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          // Keeps users signed in across launches (localStorage works in the
          // browser and in the Capacitor WebView).
          persistSession: true,
          autoRefreshToken: true,
          storageKey: 'bhaye-mindoro-auth',
          // Hash routing owns the URL fragment, so Supabase must not parse it.
          detectSessionInUrl: false,
        },
      });
    } catch (error) {
      console.error('[Bhaye Mindoro] Failed to initialize Supabase', error);
      return null;
    }
  }
  return client;
}
