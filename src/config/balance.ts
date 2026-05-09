/**
 * 数值平衡参数 · 对应 docs/GAMEPLAY.md §九
 *
 * v0.1 只放占位。v0.2 开始进战斗后，所有伤害/回血/掉落数值都集中到这里。
 */

export const balance = {
  // 单卡期望伤害带（L1 平衡护栏）
  expectedDamagePerTurn: { min: 3.5, max: 5.5 },

  // 构筑胜率目标（L2）
  targetWinRate: { min: 0.4, max: 0.7 },

  // 封妖节奏（L3）
  yaoSealsPerRun: { min: 3, max: 5 },

  // 战斗节奏（L4）
  turnsPerNormalFight: { min: 3, max: 5 },
  turnsPerBossFight: { min: 6, max: 10 },
} as const;
