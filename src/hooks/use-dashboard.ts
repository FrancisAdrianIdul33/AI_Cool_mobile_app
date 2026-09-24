import { useCallback } from 'react';

import { useAuth } from '@/context/auth';
import {
  getDashboard,
  getTodayActivity,
  getWeeklyCarbon,
  logCarbonActivity,
  type LogCarbonInput,
} from '@/lib/api';
import type { ActivityLog, DashboardData, WeekDayCarbon } from '@/lib/types';
import { useQuery, type UseQueryResult } from '@/hooks/use-query';

function numeric(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalize(data: {
  dashboard: Record<string, unknown> | null;
  weekly: WeekDayCarbon[];
  today: ActivityLog[];
  budget: number;
}): DashboardData {
  const { dashboard, weekly, today, budget } = data;
  const weekUsed = weekly.reduce((sum, day) => sum + numeric(day.carbon_kg), 0);

  const used = numeric(
    dashboard?.used ??
      dashboard?.total_used ??
      dashboard?.carbon_used ??
      dashboard?.weekly_used ??
      dashboard?.used_kg,
    weekUsed,
  );

  const total = numeric(dashboard?.budget ?? dashboard?.total_budget ?? data.budget, budget);

  return {
    used,
    total,
    remaining: Math.max(0, total - used),
    streak: numeric(dashboard?.streak),
    level: numeric(dashboard?.level),
    xp: numeric(dashboard?.xp),
    budget: total,
    today,
  };
}

export interface UseDashboardResult extends UseQueryResult<DashboardData> {
  streak: number;
  level: number;
  xp: number;
  isLogging: boolean;
  logError: string | null;
  logFastAction: (action: { category: string; activity_type: string; description?: string }) => Promise<void>;
}

export function useDashboard(): UseDashboardResult {
  const { profile, refreshProfile } = useAuth();

  const query = useQuery<DashboardData>(
    async () => {
      const [dashboard, weekly, today] = await Promise.all([
        getDashboard().catch(() => null),
        getWeeklyCarbon().catch(() => [] as WeekDayCarbon[]),
        getTodayActivity().catch(() => [] as ActivityLog[]),
      ]);
      return normalize({
        dashboard,
        weekly,
        today,
        budget: profile?.weekly_carbon_budget ?? 30,
      });
    },
    [profile?.id],
  );

  const logFastAction = useCallback(
    async (action: LogCarbonInput) => {
      await logCarbonActivity(action);
      await Promise.all([query.refetch(), refreshProfile()]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.refetch, refreshProfile],
  );

  return {
    ...query,
    streak: query.data?.streak ?? profile?.streak ?? 0,
    level: query.data?.level ?? profile?.level ?? 1,
    xp: query.data?.xp ?? profile?.xp ?? 0,
    isLogging: false,
    logError: null,
    logFastAction,
  };
}