// ===========================================
// STYLE HELPER UTILITIES
// Helper functions to replace nested ternaries with clear mappings
// ===========================================

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'text-green-600',
  medium: 'text-yellow-600',
  hard: 'text-red-600',
};

export function getDifficultyColor(difficulty: Difficulty): string {
  return DIFFICULTY_COLORS[difficulty];
}

// Ranking badge styles for top customers
type RankPosition = 1 | 2 | 3;

const RANK_STYLES: Record<RankPosition, string> = {
  1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  2: 'bg-gray-100 text-gray-800 border-gray-300',
  3: 'bg-orange-100 text-orange-800 border-orange-300',
};

export function getRankBadgeStyle(position: number): string {
  if (position === 1 || position === 2 || position === 3) {
    return RANK_STYLES[position];
  }
  return '';
}

// Growth indicator helper
export type GrowthDirection = 'up' | 'down' | 'neutral';

interface GrowthIndicator {
  direction: GrowthDirection;
  colorClass: string;
  prefix: string;
}

export function getGrowthIndicator(percentage: number): GrowthIndicator {
  if (percentage > 0) {
    return { direction: 'up', colorClass: 'text-green-600', prefix: '+' };
  }
  if (percentage < 0) {
    return { direction: 'down', colorClass: 'text-red-600', prefix: '' };
  }
  return { direction: 'neutral', colorClass: 'text-gray-600', prefix: '' };
}
