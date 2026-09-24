import { supabase } from '@/lib/supabase';
import type {
  ActivityLog,
  BadgeRow,
  CommunityFeedItem,
  CommunityGoal,
  LeaderboardEntry,
  MissionRow,
  Profile,
  WeekDayCarbon,
} from '@/lib/types';

export const MISSING_FUNCTION_MESSAGE =
  'Some database functions are not deployed yet. Run the project SQL migration in the Supabase SQL editor, then retry.';

export class ApiError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

function friendlyError(error: { message?: string; code?: string } | null): string {
  if (!error?.message) return 'Unexpected error. Please try again.';
  if (error.code === 'PGRST202') return MISSING_FUNCTION_MESSAGE;
  if (error.message.includes('Could not find the function')) return MISSING_FUNCTION_MESSAGE;
  return error.message;
}

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new ApiError(friendlyError(error), error.code);
  return data as T;
}

export async function getMyProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.rpc('get_my_profile');
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new ApiError(friendlyError(error), error.code);
  }
  return (data as Profile | null) ?? null;
}

export async function getDashboard(): Promise<Record<string, unknown>> {
  return rpc<Record<string, unknown>>('get_dashboard');
}

export async function getWeeklyCarbon(): Promise<WeekDayCarbon[]> {
  return rpc<WeekDayCarbon[]>('get_weekly_carbon');
}

export async function getTodayActivity(): Promise<ActivityLog[]> {
  return rpc<ActivityLog[]>('get_today_activity');
}

export async function refreshStreak(): Promise<void> {
  await rpc<unknown>('update_user_streak');
}

export async function getMyMissions(): Promise<MissionRow[]> {
  return rpc<MissionRow[]>('get_my_missions');
}

export async function getMyBadges(): Promise<BadgeRow[]> {
  return rpc<BadgeRow[]>('get_my_badges');
}

export interface LogCarbonInput {
  category: string;
  activity_type: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export async function logCarbonActivity(input: LogCarbonInput): Promise<ActivityLog> {
  return rpc<ActivityLog>('log_carbon_activity', {
    p_category: input.category,
    p_activity_type: input.activity_type,
    p_description: input.description ?? null,
    p_metadata: input.metadata ?? null,
  });
}

export async function updateMissionProgress(missionId: string): Promise<void> {
  await rpc<unknown>('update_mission_progress', { p_mission_id: missionId });
}

export async function claimMissionXp(missionId: string): Promise<void> {
  await rpc<unknown>('claim_mission_xp', { p_mission_id: missionId });
}

export async function getCommunityGoals(): Promise<CommunityGoal[]> {
  return rpc<CommunityGoal[]>('get_community_goals');
}

export async function getCommunityLeaderboard(): Promise<LeaderboardEntry[]> {
  return rpc<LeaderboardEntry[]>('get_community_leaderboard');
}

export async function getCommunityActivity(): Promise<CommunityFeedItem[]> {
  return rpc<CommunityFeedItem[]>('get_community_activity');
}

export interface UpdateProfileInput {
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
}

export async function updateMyProfile(input: UpdateProfileInput): Promise<Profile> {
  return rpc<Profile>('update_my_profile', {
    p_username: input.username ?? null,
    p_full_name: input.full_name ?? null,
    p_avatar_url: input.avatar_url ?? null,
    p_bio: input.bio ?? null,
  });
}

export async function sendFriendRequest(userId: string): Promise<void> {
  await rpc<unknown>('send_friend_request', { p_user_id: userId });
}

export async function acceptFriendRequest(userId: string): Promise<void> {
  await rpc<unknown>('accept_friend_request', { p_user_id: userId });
}