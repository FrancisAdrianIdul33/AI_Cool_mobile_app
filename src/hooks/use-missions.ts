import { useCallback, useState } from 'react';

import { useAuth } from '@/context/auth';
import { claimMissionXp, getMyBadges, getMyMissions, updateMissionProgress } from '@/lib/api';
import { levelInfo, type BadgeRow, type MissionRow } from '@/lib/types';
import { useQuery, type UseQueryResult } from '@/hooks/use-query';

export interface MissionsData {
  missions: MissionRow[];
  badges: BadgeRow[];
}

export interface UseMissionsResult extends UseQueryResult<MissionsData> {
  level: number;
  xp: number;
  xpTotal: number;
  streak: number;
  claimingId: string | null;
  actionError: string | null;
  claim: (missionId: string) => Promise<void>;
  bumpProgress: (missionId: string) => Promise<void>;
}

export function useMissions(): UseMissionsResult {
  const { profile, refreshProfile } = useAuth();

  const query = useQuery<MissionsData>(async () => {
    const [missions, badges] = await Promise.all([getMyMissions(), getMyBadges()]);
    return { missions, badges };
  }, [profile?.id]);

  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const claim = useCallback(
    async (missionId: string) => {
      setClaimingId(missionId);
      setActionError(null);
      try {
        await claimMissionXp(missionId);
        await Promise.all([query.refetch(), refreshProfile()]);
      } catch (e) {
        setActionError(e instanceof Error ? e.message : 'Could not claim XP.');
      } finally {
        setClaimingId(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.refetch, refreshProfile],
  );

  const bumpProgress = useCallback(
    async (missionId: string) => {
      setActionError(null);
      try {
        await updateMissionProgress(missionId);
        await Promise.all([query.refetch(), refreshProfile()]);
      } catch (e) {
        setActionError(e instanceof Error ? e.message : 'Could not update progress.');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.refetch, refreshProfile],
  );

  const li = levelInfo(profile?.level ?? 1, profile?.xp ?? 0);

  return {
    ...query,
    level: li.level,
    xp: li.xp,
    xpTotal: li.xpTotal,
    streak: profile?.streak ?? 0,
    claimingId,
    actionError,
    claim,
    bumpProgress,
  };
}