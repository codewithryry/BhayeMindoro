import type { User } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getSupabase, isSupabaseConfigured } from './supabase';

// Guest = using the app without an account. Every public feature works for
// guests; an account is optional.

export type AuthStatus = 'loading' | 'signed_in' | 'guest' | 'signed_out';

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  displayName: string;
  canUseAccounts: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  /** Resolves `needsConfirmation: true` when Supabase requires email confirmation first. */
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
};

const GUEST_KEY = 'bhaye-mindoro-guest';

function readGuestFlag(): boolean {
  try {
    return localStorage.getItem(GUEST_KEY) === '1';
  } catch {
    return false;
  }
}

function writeGuestFlag(value: boolean) {
  try {
    if (value) localStorage.setItem(GUEST_KEY, '1');
    else localStorage.removeItem(GUEST_KEY);
  } catch {
    // Storage unavailable (private mode): guest choice lasts for this session only.
  }
}

/** User-facing auth error. Technical details are logged, never shown. */
export class AuthError extends Error {}

function toAuthError(error: { message: string; code?: string }): AuthError {
  console.error('[Bhaye Mindoro] Auth error', error);
  const message = error.message.toLowerCase();
  if (error.code === 'invalid_credentials' || message.includes('invalid login')) {
    return new AuthError('Mali ang email o password.');
  }
  if (error.code === 'email_not_confirmed' || message.includes('not confirmed')) {
    return new AuthError('I-confirm muna ang iyong email bago mag-login.');
  }
  if (error.code === 'user_already_exists' || message.includes('already registered')) {
    return new AuthError('May account na ang email na ito. Mag-login na lang.');
  }
  if (message.includes('fetch') || message.includes('network')) {
    return new AuthError('Walang koneksyon. Subukan ulit kapag may internet.');
  }
  return new AuthError('Hindi natuloy. Subukan ulit.');
}

function nameOf(user: User | null): string {
  if (!user) return 'Guest';
  const fullName = user.user_metadata?.full_name;
  if (typeof fullName === 'string' && fullName.trim()) return fullName.trim();
  return user.email?.split('@')[0] ?? 'User';
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [guest, setGuest] = useState(readGuestFlag);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setUser(data.session?.user ?? null);
      })
      .catch((error: unknown) => console.error('[Bhaye Mindoro] Failed to restore session', error))
      .finally(() => {
        if (active) setLoading(false);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new AuthError('Hindi pa available ang login.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw toAuthError(error);
    writeGuestFlag(false);
    setGuest(false);
    setUser(data.user);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new AuthError('Hindi pa available ang pag-sign up.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw toAuthError(error);
    if (data.session) {
      writeGuestFlag(false);
      setGuest(false);
      setUser(data.user);
    }
    return { needsConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('[Bhaye Mindoro] Sign out failed', error);
    }
    writeGuestFlag(false);
    setGuest(false);
    setUser(null);
  }, []);

  const continueAsGuest = useCallback(() => {
    writeGuestFlag(true);
    setGuest(true);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const status: AuthStatus = loading
      ? 'loading'
      : user
        ? 'signed_in'
        : guest
          ? 'guest'
          : 'signed_out';
    return {
      status,
      user,
      displayName: nameOf(user),
      canUseAccounts: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
      continueAsGuest,
    };
  }, [loading, user, guest, signIn, signUp, signOut, continueAsGuest]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
