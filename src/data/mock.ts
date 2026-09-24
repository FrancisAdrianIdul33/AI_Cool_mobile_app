export type ActivityKind = 'saved' | 'emitted';

export interface Activity {
  id: string;
  icon: string;
  title: string;
  time: string;
  impact: number;
  kind: ActivityKind;
  unit?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  xpTotal: number;
  points: number;
  state: 'active' | 'locked';
  badge?: string;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  initials: string;
  kgSaved: number;
}

export interface FeedItem {
  id: string;
  name: string;
  action: string;
  time: string;
}

export const budget = {
  used: 12.4,
  total: 30,
  remaining: 17.6,
  unit: 'kg CO₂',
  week: 'This week',
};

export const quickActions: QuickAction[] = [
  { id: 'commute', label: 'Commute', icon: 'car' },
  { id: 'meals', label: 'Meals', icon: 'restaurant' },
  { id: 'energy', label: 'Home Energy', icon: 'flash' },
  { id: 'bike', label: 'Bike', icon: 'bicycle' },
];

export const stats = {
  streak: 7,
  trees: 18,
  level: 'Lv 12',
};

export const activities: Activity[] = [
  {
    id: 'a1',
    icon: 'restaurant',
    title: 'Vegetarian lunch',
    time: '12:40 PM',
    impact: 1.2,
    kind: 'saved',
  },
  {
    id: 'a2',
    icon: 'car',
    title: 'Ride-hail to campus',
    time: '8:20 AM',
    impact: 3.4,
    kind: 'emitted',
  },
  {
    id: 'a3',
    icon: 'flash',
    title: 'LED lights swap',
    time: '7:05 AM',
    impact: 0.6,
    kind: 'saved',
  },
  {
    id: 'a4',
    icon: 'walk',
    title: 'Walked to the meeting',
    time: 'Yesterday',
    impact: 0.9,
    kind: 'saved',
  },
];

export const missions = {
  level: 12,
  levelTitle: 'Ranger',
  xp: 240,
  xpTotal: 400,
};

export const weeklyMissions: Mission[] = [
  {
    id: 'm1',
    title: 'Meatless Monday',
    description: 'Skip meat for one full day this week.',
    icon: 'leaf',
    xp: 60,
    xpTotal: 100,
    points: 150,
    state: 'active',
    badge: 'Meatless Maestro',
  },
  {
    id: 'm2',
    title: 'Bike to Work 3x',
    description: 'Cycle instead of driving three times.',
    icon: 'bicycle',
    xp: 66,
    xpTotal: 100,
    points: 200,
    state: 'active',
    badge: 'Green Commuter',
  },
  {
    id: 'm3',
    title: 'Home Energy Sprint',
    description: 'Shave 10% off your electricity use.',
    icon: 'flash',
    xp: 0,
    xpTotal: 100,
    points: 120,
    state: 'locked',
  },
];

export const specialMissions: Mission[] = [
  {
    id: 's1',
    title: 'Plastic-Free Week',
    description: 'Skip single-use plastic all week.',
    icon: 'refresh',
    xp: 50,
    xpTotal: 100,
    points: 250,
    state: 'active',
    badge: 'Zero Waste Hero',
  },
  {
    id: 's2',
    title: 'Water Saver',
    description: 'Take showers under 5 minutes.',
    icon: 'water',
    xp: 0,
    xpTotal: 100,
    points: 100,
    state: 'locked',
  },
];

export const badges: Badge[] = [
  { id: 'b1', label: 'First Log', icon: 'checkmark-circle', unlocked: true },
  { id: 'b2', label: '7-Day Streak', icon: 'flame', unlocked: true },
  { id: 'b3', label: 'Green Commuter', icon: 'bicycle', unlocked: true },
  { id: 'b4', label: 'Meatless Maestro', icon: 'leaf', unlocked: true },
  { id: 'b5', label: 'Community Seed', icon: 'people', unlocked: false },
  { id: 'b6', label: 'Climate Hero', icon: 'earth', unlocked: false },
];

export const community = {
  goal: 'Plant 1,000 trees',
  completed: 0.78,
  current: 780,
  total: 1000,
  unit: 'trees',
};

export const communityStats = [
  { id: 'cs1', label: 'Trees planted', value: '780', icon: 'leaf' },
  { id: 'cs2', label: 'CO₂ saved', value: '1.2 t', icon: 'cloud-outline' },
  { id: 'cs3', label: 'Members', value: '48', icon: 'people' },
  { id: 'cs4', label: 'Actions logged', value: '3.4k', icon: 'stats-chart' },
];

export const leaderboard: LeaderboardEntry[] = [
  { id: 'l1', name: 'Ava', initials: 'AV', kgSaved: 42 },
  { id: 'l2', name: 'Kyla', initials: 'KY', kgSaved: 38 },
  { id: 'l3', name: 'Niko', initials: 'NK', kgSaved: 31 },
  { id: 'l4', name: 'Jambert', initials: 'JB', kgSaved: 24 },
  { id: 'l5', name: 'Mira', initials: 'MR', kgSaved: 19 },
  { id: 'l6', name: 'Leo', initials: 'LE', kgSaved: 15 },
];

export const communityFeed: FeedItem[] = [
  { id: 'f1', name: 'Kyla', action: 'planted a tree in Riverside Grove', time: '2m ago' },
  { id: 'f2', name: 'Niko', action: 'logged a bike commute (1.8 kg saved)', time: '18m ago' },
  { id: 'f3', name: 'Ava', action: 'hit her weekly budget — again', time: '1h ago' },
  { id: 'f4', name: 'Mira', action: 'meatless lunch with the class', time: '2h ago' },
];

export const profile = {
  name: 'Jambert',
  handle: '@jambert.carbontrail',
  initials: 'JB',
  level: 12,
  levelTitle: 'Ranger',
  streak: 7,
  trees: 18,
  friends: 24,
  co2Saved: '3.4 kg',
};

export const settingsRows = [
  { id: 'r1', label: 'Edit profile', icon: 'person-circle-outline' },
  { id: 'r2', label: 'My community', icon: 'people-outline' },
  { id: 'r3', label: 'Notifications', icon: 'notifications-outline' },
  { id: 'r4', label: 'Help & support', icon: 'help-buoy-outline' },
  { id: 'r5', label: 'About CarbonTrail', icon: 'information-circle-outline' },
];