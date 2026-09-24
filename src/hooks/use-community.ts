import { useAuth } from '@/context/auth';
import { getCommunityActivity, getCommunityGoals, getCommunityLeaderboard } from '@/lib/api';
import type { CommunityData, CommunityFeedItem, CommunityGoal, LeaderboardEntry } from '@/lib/types';
import { useQuery, type UseQueryResult } from '@/hooks/use-query';

export type UseCommunityResult = UseQueryResult<CommunityData>;

export function useCommunity(): UseCommunityResult {
  const { profile } = useAuth();

  return useQuery<CommunityData>(
    async () => {
      const [goals, leaderboard, feed] = await Promise.all([
        getCommunityGoals(),
        getCommunityLeaderboard(),
        getCommunityActivity(),
      ]);
      return { goals: goals ?? [], leaderboard: leaderboard ?? [], feed: feed ?? [] };
    },
    [profile?.id],
  );
}

export function selfPlayerId(leaderboard: LeaderboardEntry[], profileId?: string): string | null {
  if (!profileId) return null;
  const self = leaderboard.find((entry) => entry.id === profileId);
  return self ? profileId : null;
}

export function activeGoal(goals: CommunityGoal[]): CommunityGoal | null {
  return goals.find((goal) => goal.is_active) ?? goals[0] ?? null;
}

export function feedSummary(feed: CommunityFeedItem[]): {
  actionsLogged: number;
} {
  return { actionsLogged: feed.length };
}