export type CellType = 'empty' | 'windmill' | 'house' | 'factory' | 'battery' | 'wire';

export type ToolType = CellType | 'remove';

export type MoodType = 'calm' | 'focus' | 'vitality' | 'stable' | 'chaos' | 'none';

export interface GridCell {
  x: number;
  y: number;
  type: CellType;
  rotation: number;
  powered: boolean;
  faulty: boolean;
}

export const GRID_SIZE = 8;

export const BUILDING_STATS = {
  windmill: { dayGen: 5, nightGen: 1, consumption: 0, name: '风车', emoji: '🌀' },
  house: { dayGen: 0, nightGen: 0, consumption: 2, name: '住房', emoji: '🏠' },
  factory: { dayGen: 0, nightGen: 0, consumption: 4, name: '工坊', emoji: '🏭' },
  battery: { dayGen: 0, nightGen: 0, consumption: 0, storage: 20, name: '蓄电池', emoji: '🔋' },
  wire: { dayGen: 0, nightGen: 0, consumption: 0, name: '电线', emoji: '⚡' },
} as const;

export const WIRE_CONNECTIONS: Record<number, [boolean, boolean, boolean, boolean]> = {
  0: [true, false, true, false],
  1: [false, true, false, true],
  2: [true, true, false, false],
  3: [true, false, false, true],
  4: [false, true, true, false],
  5: [false, false, true, true],
};

export const DIR_OFFSETS: Array<[number, number]> = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export const TOOLS: Array<{ type: ToolType; name: string; emoji: string; description: string }> = [
  { type: 'windmill', name: '风车', emoji: '🌀', description: '白天+5电，夜晚+1电' },
  { type: 'house', name: '住房', emoji: '🏠', description: '消耗2电，提供满意度' },
  { type: 'factory', name: '工坊', emoji: '🏭', description: '消耗4电，生产物资' },
  { type: 'battery', name: '蓄电池', emoji: '🔋', description: '存储20电量' },
  { type: 'wire', name: '电线', emoji: '⚡', description: '传导电力，右键/R旋转' },
  { type: 'remove', name: '拆除', emoji: '🗑️', description: '移除建筑或电线' },
];

export const DAY_LENGTH = 100;
export const DAY_THRESHOLD = 50;
export const TICK_INTERVAL = 300;
export const FAULT_CHANCE = 0.002;

export const BUILDING_MOOD: Record<CellType, MoodType> = {
  empty: 'none',
  windmill: 'vitality',
  house: 'calm',
  factory: 'focus',
  battery: 'stable',
  wire: 'none',
};

export const MOOD_COLORS: Record<MoodType, string> = {
  calm: '#60A5FA',
  focus: '#A78BFA',
  vitality: '#34D399',
  stable: '#FBBF24',
  chaos: '#F87171',
  none: '#9CA3AF',
};

export const MOOD_NAMES: Record<MoodType, string> = {
  calm: '安宁',
  focus: '专注',
  vitality: '活力',
  stable: '稳定',
  chaos: '混乱',
  none: '无',
};

export const MOOD_BONUS_THRESHOLDS = [
  { min: 2, bonus: 0.1 },
  { min: 4, bonus: 0.2 },
  { min: 6, bonus: 0.35 },
  { min: 8, bonus: 0.5 },
];

export const CHAOS_PENALTY = 0.15;

export interface MoodRegion {
  mood: MoodType;
  cells: Array<{ x: number; y: number }>;
  bonus: number;
}

export interface MoodBonus {
  calmConsumptionReduction: number;
  focusOutputBoost: number;
  vitalityDayGenBoost: number;
  stableStorageBoost: number;
  chaosPenalty: number;
  regions: MoodRegion[];
}
