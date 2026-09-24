import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { getMyProfile, refreshStreak } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  isAuthLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username?: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(): Promise<Profile | null> {
  try {
    return await getMyProfile();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const streakRefreshedFor = useRef<string | null>(null);

  const refreshProfile = useCallback(async () => {
    setProfile(await fetchProfile());
  }, []);

  const bootstrapSession = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    if (nextSession) {
      const [loadedProfile] = await Promise.all([
        fetchProfile(),
        streakRefreshedFor.current === nextSession.user.id
          ? Promise.resolve()
          : refreshStreak().catch(() => undefined),
      ]);
      streakRefreshedFor.current = nextSession.user.id;
      setProfile(loadedProfile);
    } else {
      setProfile(null);
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) bootstrapSession(data.session);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) bootstrapSession(nextSession);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [bootstrapSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, username?: string, fullName?: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: username ?? null, full_name: fullName ?? null } },
      });
      if (error) throw new Error(error.message);
      let attempts = 0;
      while (attempts < 6) {
        const created = await fetchProfile();
        if (created) {
          setProfile(created);
          return;
        }
        attempts += 1;
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        isAuthLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}