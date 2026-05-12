/**
 * 数值平衡参数 · v0.2 封妖 MVP
 *
 * 所有"经常调的数字"都在这里。对齐 docs/BALANCE.md。
 * 改数字 = 改这里 + BALANCE.md，不要散落到代码中。
 */

export const balance = {
  /** ======================================================================
   *  L1~L4 平衡护栏（仿真验收目标）
   *  ====================================================================== */
  // 单卡期望伤害带
  expectedDamagePerTurn: { min: 3.5, max: 5.5 },
  // 构筑胜率目标（0~1）
  targetWinRate: { min: 0.4, max: 0.7 },
  // 每 run 封妖数
  yaoSealsPerRun: { min: 2, max: 4 },
  // 战斗节奏（回合）
  turnsPerNormalFight: { min: 3, max: 5 },
  turnsPerBossFight: { min: 6, max: 10 },

  /** ======================================================================
   *  玩家初始参数
   *  ====================================================================== */
  player: {
    maxHp: 70,
    handSizePerTurn: 5,
    energyPerTurn: 3,
    deckSizeStart: 10,
    deckSizeMax: 20,
  },

  /** ======================================================================
   *  战后回血
   *  ====================================================================== */
  heal: {
    /** normal 战 → maxHp × 0.10 */
    normal: 0.1,
    elite: 0.15,
    boss: 0.3,
    /** Boss 战胜利永久 maxHp +X */
    bossMaxHpGain: 5,
  },

  /** ======================================================================
   *  灵气奖励
   *  ====================================================================== */
  rewardCurrency: {
    normal: [10, 15] as [number, number],
    elite: [25, 35] as [number, number],
    boss: [50, 60] as [number, number],
  },

  /** ======================================================================
   *  祭坛（商店）
   *  ====================================================================== */
  shrine: {
    upgradeCardCost: 30, // 升级一张卡
    removeCardCost: 20,  // 删一张卡
    /** 升级后伤害 / block 加成 */
    upgradeBonus: 2,
    /** 驯妖：-妖性（每次） */
    tameCardCost: 25,
    tameAmount: 20,
  },

  /** ======================================================================
   *  妖性系统（v0.2.1 启用）
   *  ====================================================================== */
  yaoxing: {
    /** 打出一张妖卡增加的妖性 */
    perPlay: 5,
    /** 战斗结束每张妖卡妖性递减（闲置） */
    decayPerBattle: 1,
    /** 阈值 */
    calm: 30,       // < 30 温顺
    restless: 60,   // 30-60 躁动（10% 自残 3）
    frenzy: 90,     // 60-90 狂乱（必自残 5 + 25% 弃 1）
    /** ≥ 90 噬主（不可打出 + 每回合自残 5） */
    selfHarmRestless: 3,
    selfHarmFrenzy: 5,
    selfHarmOwn: 5,
    restlessProc: 0.1,
    frenzyDiscardProc: 0.25,
  },

  /** ======================================================================
   *  拼符封印（v0.3 拼符系统）
   *  ====================================================================== */
  seal: {
    /** 敌 HP ≤ 此比例触发 SEAL_CHOICE */
    thresholdHpPercent: 0.3,
    /** 封印胜利回血系数（相对斩） */
    healOnSealMultiplier: 0.5,
    /** 封妖灵气奖励（相对斩的比例） */
    currencyRatio: 0.2,
    /** 封妖后初始妖性（v0.2.1 启用） */
    initialYaoxing: { C: 10, B: 30, S: 50 } as const,
    /** 拼符失败惩罚：玩家扣血 */
    failPenaltyHp: 8,
    /** 拼符笔画数量（按 rank） */
    patternLength: { C: 3, B: 5, S: 7 } as const,
    /** 每笔画的计时时间（毫秒） */
    timePerStroke: 3000,
    /** 每笔画的计时时间 · 完美挑战（Boss/精英） */
    timePerStrokePerfect: 1500,
    /** 完美封印奖励：额外妖性降低 */
    perfectBonusYaoxingReduction: 5,
    /** 完美封印奖励：封后卡额外 + 伤害 */
    perfectBonusDamageBonus: 3,
    /** 随章节解锁的笔画（v0.3 全章节解锁全部 6 种） */
    strokeUnlocks: {
      qingqiu: ['dot', 'horizontal', 'vertical', 'slash', 'hook', 'loop'],
      taotie:  ['dot', 'horizontal', 'vertical', 'slash', 'hook', 'loop'],
      guixu:   ['dot', 'horizontal', 'vertical', 'slash', 'hook', 'loop'],
      kunlun:  ['dot', 'horizontal', 'vertical', 'slash', 'hook', 'loop'],
      hundun:  ['dot', 'horizontal', 'vertical', 'slash', 'hook', 'loop'],
    } as Record<string, import('../types').StrokeKind[]>,
    /** 10 种符阵（用于 UI 背景） */
    sealFormations: ['ling', 'ji', 'yu', 'hua', 'chen', 'xuan', 'ming', 'kong', 'lai', 'gui'] as const,
  },

  /** ======================================================================
   *  夜间反噬（妖性聚合）
   *  ====================================================================== */
  backlash: {
    /** 牌组妖卡平均妖性 ≥ 此值，每个非战斗节点后触发 */
    threshold: 50,
    /** 反噬伤害（maxHp 百分比） */
    damagePercent: 0.1,
  },

  /** ======================================================================
   *  战后 3 选 1 卡牌稀有度概率（DESIGN §3.3）
   *  ====================================================================== */
  rewardRarityWeights: {
    normal: { common: 0.70, rare: 0.25, epic: 0.05, legend: 0 },
    elite:  { common: 0.30, rare: 0.50, epic: 0.18, legend: 0.02 },
    boss:   { common: 0,    rare: 0.30, epic: 0.55, legend: 0.15 },
  },

  /** ======================================================================
   *  地图生成（第一章）
   *  ====================================================================== */
  map: {
    /** 线性 8 节点固定配置（DESIGN §8.1） */
    chapter1Pattern: [
      'battle', 'battle', 'event', 'battle', 'shrine', 'elite', 'battle', 'boss',
    ] as const,
  },

  /** ======================================================================
   *  AI 仿真参数（runBaseline.ts 用）
   *  ====================================================================== */
  sim: {
    /** AI 优先保留够用的 block（敌下一击期望伤害） */
    aiBlockSafetyRatio: 1.0,
    /** AI 出牌上限（防死循环） */
    maxActionsPerTurn: 20,
  },

  /** ======================================================================
   *  v0.5 阴阳双道职业
   *  ====================================================================== */
  dualPath: {
    /** 每回合阴/阳能量 */
    energyPerTurn: 3,
    /** 太极归一积蓄所需 |balance| 阈值 */
    taijiThreshold: 3,
    /** 极端偏阴触发增益（balance ≤ -3）：+1 力量 */
    yinExtremeStrength: 1,
    /** 极端偏阳触发易伤（balance ≥ 3）：1 层易伤 */
    yangExtremeVulnerable: 1,
    /** 打出阴卡对阳平衡值影响 */
    yinOnYinBalance: 1,
    /** 打出阳卡对阴平衡值影响 */
    yangOnXinBalance: 1,
    /** 太极归一消耗能量 */
    taijiCost: 0,
    /** 太极归一伤害 */
    taijiDamage: 30,
    /** 太极归一治疗 */
    taijiHeal: 10,
  },
} as const;
