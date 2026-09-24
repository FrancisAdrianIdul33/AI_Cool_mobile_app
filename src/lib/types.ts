export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  level: number;
  xp: number;
  streak: number;
  longest_streak: number;
  weekly_carbon_budget: number;
  created_at: string;
  updated_at: string;
}

export type MissionType = 'activity_count' | 'carbon_reduction' | 'streak';

export interface MissionRow {
  id: string;
  title: string;
  description: string;
  mission_type: MissionType;
  period: string;
  target_value: number;
  xp_reward: number;
  carbon_reward: number;
  icon: string;
  badge_icon: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  xp_claimed: boolean;
}

export interface BadgeRow {
  badge_id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlocked_at: string | null;
}

export interface WeekDayCarbon {
  date: string;
  carbon_kg: number;
  carbon_saved_kg: number;
}

export interface ActivityLog {
  id?: string;
  user_id?: string;
  category: string;
  activity_type: string;
  description: string | null;
  carbon_kg: number;
  carbon_saved_kg: number;
  activity_date: string;
  metadata: Record<string, unknown> | null;
  created_at?: string;
}

export interface CommunityGoal {
  id: string;
  title: string;
  description: string | null;
  target_value: number;
  current_value: number;
  unit: string;
  end_date: string | null;
  is_active: boolean;
}

export interface LeaderboardEntry {
  id: string;
  username: string | null;
  full_name: string | null;
  carbon_saved_kg: number;
}

export interface CommunityFeedItem {
  id: string;
  username: string | null;
  full_name: string | null;
  activity_type: string;
  category: string;
  carbon_saved_kg: number;
  carbon_kg: number;
  description: string | null;
  created_at: string;
}

export interface CommunityData {
  goals: CommunityGoal[];
  leaderboard: LeaderboardEntry[];
  feed: CommunityFeedItem[];
}

export interface DashboardData {
  used: number;
  total: number;
  remaining: number;
  streak: number;
  level: number;
  xp: number;
  budget: number;
  today: ActivityLog[];
}

export interface LevelInfo {
  level: number;
  xp: number;
  xpTotal: number;
}

export const XP_PER_LEVEL = 500;

export function levelInfo(level: number, xp: number): LevelInfo {
  const base = Math.max(1, level - 1) * XP_PER_LEVEL;
  return { level, xp: Math.max(0, xp - base), xpTotal: XP_PER_LEVEL };
}

export function initialsOf(name: string | null | undefined): string {
  if (!name) return 'JB';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'JB';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const MISSION_ICONS: Record<string, string> = {
  bike: 'bicycle',
  leaf: 'leaf',
  bolt: 'flash',
  flame: 'flame',
  car: 'car',
  bus: 'bus',
  walk: 'walk',
  lightbulb: 'bulb',
  water: 'water',
  reset: 'refresh',
  default: 'leaf',
};

export const CATEGORY_ICONS: Record<string, string> = {
  transport: 'car',
  food: 'restaurant',
  home: 'flash',
  default: 'leaf',
};

export interface FeedActivity {
  id: string;
  icon: string;
  title: string;
  time: string;
  impact: number;
  kind: 'saved' | 'emitted';
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  category: string;
  activityType: string;
  description: string;
}