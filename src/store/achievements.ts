export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface GameStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  totalDamageDealt: number;
  totalHealing: number;
  cardsPlayed: number;
  highestDamage: number;
  longestWinStreak: number;
  currentWinStreak: number;
}

const ACHIEVEMENTS_DATA: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_win', name: '首胜', description: '赢得第一场战斗', icon: '🏆' },
  { id: 'first_loss', name: '初战', description: '经历第一次失败', icon: '💀' },
  { id: 'win_3', name: '三连胜', description: '连续赢得3场战斗', icon: '🔥' },
  { id: 'deal_50_damage', name: '毁灭打击', description: '累计造成50点伤害', icon: '💥' },
  { id: 'heal_30', name: '治疗者', description: '累计恢复30点生命', icon: '💚' },
  { id: 'play_50_cards', name: '牌库掌控', description: '累计使用50张卡牌', icon: '🎴' },
  { id: 'kill_elite', name: '精英猎手', description: '击败一个精英敌人', icon: '⚔️' },
  { id: 'kill_boss', name: 'Boss杀手', description: '击败一个Boss', icon: '👿' },
];

const STORAGE_KEY = 'card-roguelike-stats';

export function getStats(): GameStats {
  const defaultStats: GameStats = {
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    totalDamageDealt: 0,
    totalHealing: 0,
    cardsPlayed: 0,
    highestDamage: 0,
    longestWinStreak: 0,
    currentWinStreak: 0,
  };

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultStats;
    return JSON.parse(data);
  } catch {
    return defaultStats;
  }
}

export function updateStats(updates: Partial<GameStats>): void {
  const stats = getStats();
  const newStats = { ...stats, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
}

export function incrementStat(key: keyof GameStats, amount: number = 1): void {
  const stats = getStats();
  stats[key] = (stats[key] || 0) + amount;

  // Check for longest win streak
  if (key === 'currentWinStreak' && stats.currentWinStreak > stats.longestWinStreak) {
    stats.longestWinStreak = stats.currentWinStreak;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function getAchievements(): Achievement[] {
  const stats = getStats();

  return ACHIEVEMENTS_DATA.map(achievement => {
    let unlocked = false;

    switch (achievement.id) {
      case 'first_win':
        unlocked = stats.totalWins >= 1;
        break;
      case 'first_loss':
        unlocked = stats.totalLosses >= 1;
        break;
      case 'win_3':
        unlocked = stats.longestWinStreak >= 3;
        break;
      case 'deal_50_damage':
        unlocked = stats.totalDamageDealt >= 50;
        break;
      case 'heal_30':
        unlocked = stats.totalHealing >= 30;
        break;
      case 'play_50_cards':
        unlocked = stats.cardsPlayed >= 50;
        break;
      case 'kill_elite':
        unlocked = false; // Would need to track this separately
        break;
      case 'kill_boss':
        unlocked = false; // Would need to track this separately
        break;
    }

    return { ...achievement, unlocked };
  });
}