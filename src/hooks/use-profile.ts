import { useCallback, useState } from 'react';

import { useAuth } from '@/context/auth';
import { updateMyProfile, type UpdateProfileInput } from '@/lib/api';
import type { Profile } from '@/lib/types';

export interface UseProfileResult {
  profile: Profile | null;
  profileLoading: boolean;
  profileReady: boolean;
  saving: boolean;
  error: string | null;
  save: (input: UpdateProfileInput) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProfile(): UseProfileResult {
  const { profile, isAuthLoading, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (input: UpdateProfileInput) => {
      setSaving(true);
      setError(null);
      try {
        await updateMyProfile(input);
        await refreshProfile();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not save profile.');
      } finally {
        setSaving(false);
      }
    },
    [refreshProfile],
  );

  return {
    profile,
    profileLoading: isAuthLoading,
    profileReady: !isAuthLoading,
    saving,
    error,
    save,
    refresh: refreshProfile,
  };
}