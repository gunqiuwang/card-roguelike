/**
 * 妖怪库 · v1.0 完整版
 *
 * 四章：青丘 / 饕餮 / 归墟 / 昆仑
 * 含全部 24 只可封妖怪 + Boss + 精英
 */

import type { Yao } from '../../types';

// ============================================================================
// 第一章 · 青丘残岭
// ============================================================================

export const YAO_QINGHU: Yao = {
  id: 'qinghu',
  name: '青狐小妖',
  rank: 'C',
  chapter: 'qingqiu',
  hp: 42,
  artSrc: '/images/qinghu.jpg',
  intents: [
    { kind: 'attack', damage: 7, label: '⚔ 7' },
    { kind: 'attack', damage: 5, label: '⚔ 5' },
    { kind: 'defend', block: 5, label: '🛡 5' },
  ],
  sealPattern: ['dot', 'horizontal', 'dot'],
  sealFormation: 'ling',
  sealedCard: {
    name: '狐媚',
    type: 'yao', rarity: 'common', school: 'yuling', cost: 1,
    description: '抽 1 张牌，使敌中毒 1 层。',
    flavor: '——三只眼里，最亮那只是饿的。',
    effects: [
      { kind: 'draw', count: 1 },
      { kind: 'applyStatus', status: 'poison', stack: 1, target: 'enemy' },
    ],
    silhouette: 'fox',
  },
  flavor: '她三只眼，最亮的那只，是饿的。',
  silhouette: 'fox',
  rewardCurrency: [10, 15],
};

export const YAO_YEHU: Yao = {
  id: 'yehu',
  name: '夜狐',
  rank: 'C',
  chapter: 'qingqiu',
  hp: 48,
  artSrc: '/images/yehu.jpg',
  intents: [
    { kind: 'attack', damage: 6, label: '⚔ 6' },
    { kind: 'attack', damage: 6, label: '⚔ 6' },
    { kind: 'cast', status: { kind: 'weak', stack: 1 }, label: '✨ 虚弱 1' },
  ],
  sealPattern: ['vertical', 'dot', 'slash'],
  sealFormation: 'ji',
  sealedCard: {
    name: '夜袭',
    type: 'yao', rarity: 'common', school: 'zhanyao', cost: 1,
    description: '造成 5 点伤害，使敌易伤 1 层。',
    flavor: '——夜里不要回头。它跟着你的影子吃。',
    effects: [
      { kind: 'damage', amount: 5 },
      { kind: 'applyStatus', status: 'vulnerable', stack: 1, target: 'enemy' },
    ],
    silhouette: 'fox',
  },
  flavor: '夜里不要回头。它跟着你的影子吃。',
  silhouette: 'fox',
  rewardCurrency: [12, 18],
};

export const YAO_XIAOSHOU: Yao = {
  id: 'xiaoshou',
  name: '鸮首',
  rank: 'C',
  chapter: 'qingqiu',
  hp: 36,
  artSrc: '/images/xiaoshou.jpg',
  intents: [
    { kind: 'attack', damage: 4, label: '⚔ 4' },
    { kind: 'cast', status: { kind: 'vulnerable', stack: 1 }, label: '✨ 易伤 1' },
    { kind: 'attack', damage: 8, label: '⚔ 8' },
  ],
  sealPattern: ['horizontal', 'slash', 'dot'],
  sealFormation: 'ming',
  sealedCard: {
    name: '鸮啼',
    type: 'yao', rarity: 'common', school: 'zhanyao', cost: 1,
    description: '造成 4 点伤害，使敌易伤 1 层。',
    flavor: '——夜半一声啼，山半都醒了。',
    effects: [
      { kind: 'damage', amount: 4 },
      { kind: 'applyStatus', status: 'vulnerable', stack: 1, target: 'enemy' },
    ],
    silhouette: 'bird',
  },
  flavor: '鸟形人面，闻其啼者，病。',
  silhouette: 'bird',
  rewardCurrency: [10, 14],
};

export const YAO_CAOTOU_SHE: Yao = {
  id: 'caotou_she',
  name: '草头蛇',
  rank: 'C',
  chapter: 'qingqiu',
  hp: 40,
  artSrc: '/images/caotou_she.jpg',
  intents: [
    { kind: 'cast', status: { kind: 'poison', stack: 2 }, label: '🩸 毒 2' },
    { kind: 'attack', damage: 4, label: '⚔ 4' },
    { kind: 'defend', block: 4, label: '🛡 4' },
  ],
  sealPattern: ['vertical', 'hook', 'dot'],
  sealFormation: 'kong',
  sealedCard: {
    name: '蛇毒',
    type: 'yao', rarity: 'common', school: 'fushu', cost: 1,
    description: '使敌中毒 2 层。',
    flavor: '——草中藏牙，一口即亡。',
    effects: [{ kind: 'applyStatus', status: 'poison', stack: 2, target: 'enemy' }],
    silhouette: 'serpent',
  },
  flavor: '青草中三点白。那是牙。',
  silhouette: 'serpent',
  rewardCurrency: [10, 15],
};

export const YAO_JIUWEI_ELITE: Yao = {
  id: 'jiuweihu_elite',
  name: '九尾狐·绯',
  rank: 'B',
  chapter: 'qingqiu',
  hp: 88,
  artSrc: '/images/jiuweihu_elite.jpg',
  intents: [
    { kind: 'attack', damage: 9, label: '⚔ 9' },
    { kind: 'defend', block: 7, label: '🛡 7' },
    { kind: 'charge', label: '🌀 蓄力中' },
    { kind: 'charge', label: '🌀🌀 蓄力更强' },
    { kind: 'attack', damage: 16, label: '⚔ 16 (释)' },
  ],
  sealPattern: ['loop', 'dot', 'horizontal', 'slash', 'hook'],
  sealFormation: 'yu',
  chargeClimaxIndex: 4,
  interruptHpPercent: 0.5,
  sealedCard: {
    name: '九尾幻术',
    type: 'yao', rarity: 'rare', school: 'yuling', cost: 1,
    description: '使敌下回合意图空过。',
    flavor: '——她说：你看见的从来不是我。',
    effects: [{ kind: 'sealIntent', turns: 1 }],
    silhouette: 'fox',
  },
  flavor: '她说：你看见的从来不是我。',
  silhouette: 'fox',
  rewardCurrency: [30, 40],
};

export const YAO_JIUWEI_BOSS: Yao = {
  id: 'jiuweihu_boss',
  name: '绯·九尾真身',
  rank: 'S',
  chapter: 'qingqiu',
  hp: 140,
  artSrc: '/images/jiuweihu_boss.jpg',
  intents: [
    { kind: 'attack', damage: 11, label: '⚔ 11' },
    { kind: 'defend', block: 9, label: '🛡 9' },
    { kind: 'charge', label: '🌀 蓄力' },
    { kind: 'charge', label: '🌀🌀 蓄力更强' },
    { kind: 'attack', damage: 20, status: { kind: 'weak', stack: 2 }, label: '⚔ 20 + 虚 2' },
  ],
  sealPattern: ['loop', 'dot', 'horizontal', 'vertical', 'slash', 'hook', 'dot'],
  sealFormation: 'hua',
  chargeClimaxIndex: 4,
  interruptHpPercent: 0.4,
  sealedCard: {
    name: '幻狐之瞳',
    type: 'yao', rarity: 'epic', school: 'yuling', cost: 2,
    description: '造成 12 点伤害，抽 1 张牌。',
    flavor: '——我活了很久。你封了我，我便住你身里。',
    effects: [
      { kind: 'damage', amount: 12 },
      { kind: 'draw', count: 1 },
    ],
    silhouette: 'fox',
  },
  flavor: '我活了很久了。你封了我，我就住在你身体里。',
  silhouette: 'fox',
  rewardCurrency: [55, 65],
};

// ============================================================================
// 第二章 · 饕餮古镇（贪婪/欲望主题）
// ============================================================================

export const YAO_TAOTIE_LORD: Yao = {
  id: 'taotie_lord',
  name: '饕餮之主',
  rank: 'S',
  chapter: 'taotie',
  hp: 165,
  artSrc: '/images/taotie_lord.jpg',
  intents: [
    { kind: 'attack', damage: 14, label: '⚔ 14' },
    { kind: 'cast', status: { kind: 'vulnerable', stack: 2 }, label: '✨ 易伤 2' },
    { kind: 'charge', label: '🌀 饱食蓄力' },
    { kind: 'charge', label: '🌀🌀 饱食更强' },
    { kind: 'attack', damage: 24, status: { kind: 'poison', stack: 3 }, label: '⚔ 24 + 毒 3' },
  ],
  sealPattern: ['loop', 'horizontal', 'dot', 'slash', 'vertical', 'hook', 'dot'],
  sealFormation: 'lai',
  chargeClimaxIndex: 4,
  interruptHpPercent: 0.35,
  sealedCard: {
    name: '贪欲之噬',
    type: 'yao', rarity: 'legend', school: 'zhanyao', cost: 2,
    description: '造成 15 点伤害，使敌易伤 2 层，抽 1 张。',
    flavor: '——它吃过的，都变成了它的骨头。',
    effects: [
      { kind: 'damage', amount: 15 },
      { kind: 'applyStatus', status: 'vulnerable', stack: 2, target: 'enemy' },
      { kind: 'draw', count: 1 },
    ],
    silhouette: 'relic',
  },
  flavor: '它吃过的，都变成了它的骨头。',
  silhouette: 'relic',
  rewardCurrency: [65, 80],
};

export const YAO_GOLD_EATER: Yao = {
  id: 'gold_eater',
  name: '食金兽',
  rank: 'B',
  chapter: 'taotie',
  hp: 75,
  artSrc: '/images/gold_eater.jpg',
  intents: [
    { kind: 'attack', damage: 8, label: '⚔ 8' },
    { kind: 'defend', block: 10, label: '🛡 10' },
    { kind: 'attack', damage: 12, label: '⚔ 12' },
  ],
  sealPattern: ['dot', 'horizontal', 'slash', 'hook', 'dot'],
  sealFormation: 'gui',
  sealedCard: {
    name: '金甲',
    type: 'yao', rarity: 'rare', school: 'yuling', cost: 1,
    description: '获得 8 气·御。',
    flavor: '——金衣裳，铁心肠。',
    effects: [{ kind: 'block', amount: 8 }],
    silhouette: 'relic',
  },
  flavor: '吞金吐银，眼里只有光。',
  silhouette: 'relic',
  rewardCurrency: [28, 38],
};

export const YAO_DESIRE_GHOST: Yao = {
  id: 'desire_ghost',
  name: '欲念鬼',
  rank: 'C',
  chapter: 'taotie',
  hp: 38,
  artSrc: '/images/desire_ghost.jpg',
  intents: [
    { kind: 'cast', status: { kind: 'weak', stack: 1 }, label: '✨ 虚 1' },
    { kind: 'attack', damage: 5, label: '⚔ 5' },
    { kind: 'cast', status: { kind: 'vulnerable', stack: 1 }, label: '✨ 易 1' },
  ],
  sealPattern: ['vertical', 'dot', 'horizontal'],
  sealFormation: 'xuan',
  sealedCard: {
    name: '欲火',
    type: 'yao', rarity: 'common', school: 'fushu', cost: 0,
    description: '抽 1 张，使敌易伤 1 层。',
    flavor: '——你的欲，就是它的食。',
    effects: [
      { kind: 'draw', count: 1 },
      { kind: 'applyStatus', status: 'vulnerable', stack: 1, target: 'enemy' },
    ],
    silhouette: 'humanoid',
  },
  flavor: '你的欲，就是它的食。',
  silhouette: 'humanoid',
  rewardCurrency: [10, 16],
};

export const YAO_STONE_GUARDIAN: Yao = {
  id: 'stone_guardian',
  name: '石守将',
  rank: 'B',
  chapter: 'taotie',
  hp: 95,
  artSrc: '/images/stone_guardian.jpg',
  intents: [
    { kind: 'defend', block: 12, label: '🛡 12' },
    { kind: 'attack', damage: 10, label: '⚔ 10' },
    { kind: 'defend', block: 8, label: '🛡 8' },
    { kind: 'attack', damage: 15, label: '⚔ 15' },
  ],
  sealPattern: ['horizontal', 'vertical', 'dot', 'slash', 'hook'],
  sealFormation: 'chen',
  sealedCard: {
    name: '石肤',
    type: 'yao', rarity: 'rare', school: 'yuling', cost: 2,
    description: '获得 12 气·御，使敌易伤 1 层。',
    flavor: '——山不动，它不动。山动，它也不动。',
    effects: [
      { kind: 'block', amount: 12 },
      { kind: 'applyStatus', status: 'vulnerable', stack: 1, target: 'enemy' },
    ],
    silhouette: 'humanoid',
  },
  flavor: '山不动，它不动。山动，它也不动。',
  silhouette: 'humanoid',
  rewardCurrency: [32, 42],
};

export const YAO_FURNACE_WRAITH: Yao = {
  id: 'furnace_wraith',
  name: '炉精',
  rank: 'C',
  chapter: 'taotie',
  hp: 44,
  artSrc: '/images/furnace_wraith.jpg',
  intents: [
    { kind: 'attack', damage: 9, label: '⚔ 9' },
    { kind: 'defend', block: 3, label: '🛡 3' },
    { kind: 'attack', damage: 6, label: '⚔ 6' },
  ],
  sealPattern: ['dot', 'slash', 'vertical'],
  sealFormation: 'ming',
  sealedCard: {
    name: '炉火',
    type: 'yao', rarity: 'common', school: 'fushu', cost: 1,
    description: '造成 7 点伤害。',
    flavor: '——炉中无火，炉中有火。',
    effects: [{ kind: 'damage', amount: 7 }],
    silhouette: 'relic',
  },
  flavor: '炉中无火，炉中有火。',
  silhouette: 'relic',
  rewardCurrency: [11, 17],
};

// ============================================================================
// 第三章 · 归墟冥海（死亡/深海主题）
// ============================================================================

export const YAO_SEA_EMPEROR: Yao = {
  id: 'sea_emperor',
  name: '海皇·禹',
  rank: 'S',
  chapter: 'guixu',
  hp: 180,
  artSrc: '/images/sea_emperor.jpg',
  intents: [
    { kind: 'attack', damage: 12, label: '⚔ 12' },
    { kind: 'defend', block: 15, label: '🛡 15' },
    { kind: 'cast', status: { kind: 'poison', stack: 3 }, label: '🩸 深海毒 3' },
    { kind: 'charge', label: '🌀 海啸蓄力' },
    { kind: 'charge', label: '🌀🌀 海啸更强' },
    { kind: 'attack', damage: 26, status: { kind: 'vulnerable', stack: 2 }, label: '⚔ 26 + 易 2' },
  ],
  sealPattern: ['loop', 'vertical', 'dot', 'horizontal', 'slash', 'hook', 'dot'],
  sealFormation: 'kong',
  chargeClimaxIndex: 5,
  interruptHpPercent: 0.4,
  sealedCard: {
    name: '海皇之泪',
    type: 'yao', rarity: 'legend', school: 'yuling', cost: 2,
    description: '造成 14 点伤害，使敌中毒 2 层，回复 5 气血。',
    flavor: '——禹王治水，身沉归墟。泪化为珠，珠化为魄。',
    effects: [
      { kind: 'damage', amount: 14 },
      { kind: 'applyStatus', status: 'poison', stack: 2, target: 'enemy' },
      { kind: 'heal', amount: 5 },
    ],
    silhouette: 'fish',
  },
  flavor: '禹王治水，身沉归墟。泪化为珠，珠化为魄。',
  silhouette: 'fish',
  rewardCurrency: [70, 85],
};

export const YAO_DEAD_SAILOR: Yao = {
  id: 'dead_sailor',
  name: '亡海员',
  rank: 'C',
  chapter: 'guixu',
  hp: 40,
  artSrc: '/images/dead_sailor.jpg',
  intents: [
    { kind: 'attack', damage: 6, label: '⚔ 6' },
    { kind: 'cast', status: { kind: 'poison', stack: 1 }, label: '🩸 毒 1' },
    { kind: 'attack', damage: 8, label: '⚔ 8' },
  ],
  sealPattern: ['slash', 'dot', 'horizontal'],
  sealFormation: 'lai',
  sealedCard: {
    name: '海葬',
    type: 'yao', rarity: 'common', school: 'fushu', cost: 1,
    description: '使敌中毒 2 层。',
    flavor: '——沉了船的海员，最后一个动作是招手。',
    effects: [{ kind: 'applyStatus', status: 'poison', stack: 2, target: 'enemy' }],
    silhouette: 'humanoid',
  },
  flavor: '沉了船的海员，最后一个动作是招手。',
  silhouette: 'humanoid',
  rewardCurrency: [10, 15],
};

export const YAO_PHANTOM_CRAB: Yao = {
  id: 'phantom_crab',
  name: '幻影蟹',
  rank: 'B',
  chapter: 'guixu',
  hp: 82,
  artSrc: '/images/phantom_crab.jpg',
  intents: [
    { kind: 'defend', block: 6, label: '🛡 6' },
    { kind: 'attack', damage: 10, label: '⚔ 10' },
    { kind: 'defend', block: 6, label: '🛡 6' },
    { kind: 'attack', damage: 14, label: '⚔ 14' },
  ],
  sealPattern: ['horizontal', 'dot', 'slash', 'vertical', 'hook'],
  sealFormation: 'gui',
  sealedCard: {
    name: '蟹鳌',
    type: 'yao', rarity: 'rare', school: 'zhanyao', cost: 1,
    description: '造成 10 点伤害，使敌脆弱 1 层。',
    flavor: '——鳌断可再生，断了你的鳌，它就用鳌断的鳌再生。',
    effects: [
      { kind: 'damage', amount: 10 },
      { kind: 'applyStatus', status: 'weak', stack: 1, target: 'enemy' },
    ],
    silhouette: 'relic',
  },
  flavor: '鳌断可再生，断了你的鳌，它就用鳌断的鳌再生。',
  silhouette: 'relic',
  rewardCurrency: [30, 40],
};

export const YAO_SEA_SERPENT: Yao = {
  id: 'sea_serpent',
  name: '深海蚺',
  rank: 'B',
  chapter: 'guixu',
  hp: 90,
  artSrc: '/images/sea_serpent.jpg',
  intents: [
    { kind: 'cast', status: { kind: 'poison', stack: 3 }, label: '🩸 毒 3' },
    { kind: 'attack', damage: 8, label: '⚔ 8' },
    { kind: 'attack', damage: 11, label: '⚔ 11' },
  ],
  sealPattern: ['vertical', 'slash', 'dot', 'horizontal', 'hook'],
  sealFormation: 'hua',
  sealedCard: {
    name: '蚺毒浸身',
    type: 'yao', rarity: 'rare', school: 'fushu', cost: 2,
    description: '使敌中毒 4 层，造成 8 点伤害。',
    flavor: '——它不是蛇，是一条会游泳的肠子。',
    effects: [
      { kind: 'applyStatus', status: 'poison', stack: 4, target: 'enemy' },
      { kind: 'damage', amount: 8 },
    ],
    silhouette: 'serpent',
  },
  flavor: '它不是蛇，是一条会游泳的肠子。',
  silhouette: 'serpent',
  rewardCurrency: [28, 38],
};

export const YAO_WAVE_SPECTER: Yao = {
  id: 'wave_specter',
  name: '浪啸幽灵',
  rank: 'C',
  chapter: 'guixu',
  hp: 35,
  artSrc: '/images/wave_specter.jpg',
  intents: [
    { kind: 'attack', damage: 10, label: '⚔ 10' },
    { kind: 'defend', block: 4, label: '🛡 4' },
    { kind: 'attack', damage: 5, label: '⚔ 5' },
  ],
  sealPattern: ['dot', 'vertical', 'slash'],
  sealFormation: 'yu',
  sealedCard: {
    name: '浪啸',
    type: 'yao', rarity: 'common', school: 'zhanyao', cost: 1,
    description: '造成 8 点伤害，获得 4 气·御。',
    flavor: '——死在海里的人，会变成浪。',
    effects: [
      { kind: 'damage', amount: 8 },
      { kind: 'block', amount: 4 },
    ],
    silhouette: 'humanoid',
  },
  flavor: '死在海里的人，会变成浪。',
  silhouette: 'humanoid',
  rewardCurrency: [9, 14],
};

// ============================================================================
// 第四章 · 昆仑仙境（神圣/天道主题）
// ============================================================================

export const YAO_KUNLUN_GUARDIAN: Yao = {
  id: 'kunlun_guardian',
  name: '昆仑守将',
  rank: 'S',
  chapter: 'kunlun',
  hp: 200,
  artSrc: '/images/kunlun_guardian.jpg',
  intents: [
    { kind: 'attack', damage: 15, label: '⚔ 15' },
    { kind: 'defend', block: 18, label: '🛡 18' },
    { kind: 'cast', status: { kind: 'vulnerable', stack: 2 }, label: '✨ 天罚 易 2' },
    { kind: 'charge', label: '🌀 天雷蓄力' },
    { kind: 'charge', label: '🌀🌀 天雷更强' },
    { kind: 'attack', damage: 28, status: { kind: 'weak', stack: 2 }, label: '⚔ 28 + 虚 2' },
  ],
  sealPattern: ['loop', 'dot', 'horizontal', 'vertical', 'slash', 'hook', 'dot'],
  sealFormation: 'ming',
  chargeClimaxIndex: 5,
  interruptHpPercent: 0.35,
  sealedCard: {
    name: '天罚雷',
    type: 'yao', rarity: 'legend', school: 'fushu', cost: 2,
    description: '对全体敌人造成 12 点伤害，使敌易伤 2 层。',
    flavor: '——天最怒时，劈的不是妖魔，是不仁。',
    effects: [
      { kind: 'damageAll', amount: 12 },
      { kind: 'applyStatus', status: 'vulnerable', stack: 2, target: 'enemy' },
    ],
    silhouette: 'hero',
  },
  flavor: '天最怒时，劈的不是妖魔，是不仁。',
  silhouette: 'hero',
  rewardCurrency: [75, 90],
};

export const YAO_CELESTIAL_DEER: Yao = {
  id: 'celestial_deer',
  name: '天鹿',
  rank: 'B',
  chapter: 'kunlun',
  hp: 80,
  artSrc: '/images/celestial_deer.jpg',
  intents: [
    { kind: 'attack', damage: 7, label: '⚔ 7' },
    { kind: 'cast', status: { kind: 'vulnerable', stack: 1 }, label: '✨ 易 1' },
    { kind: 'attack', damage: 10, label: '⚔ 10' },
    { kind: 'defend', block: 8, label: '🛡 8' },
  ],
  sealPattern: ['vertical', 'dot', 'horizontal', 'slash', 'hook'],
  sealFormation: 'chen',
  sealedCard: {
    name: '鹿角灵',
    type: 'yao', rarity: 'rare', school: 'yuling', cost: 1,
    description: '回复 6 气血，获得 5 气·御。',
    flavor: '——食神草，饮露水，一步跨昆仑。',
    effects: [
      { kind: 'heal', amount: 6 },
      { kind: 'block', amount: 5 },
    ],
    silhouette: 'hero',
  },
  flavor: '食神草，饮露水，一步跨昆仑。',
  silhouette: 'hero',
  rewardCurrency: [30, 42],
};

export const YAO_CLOUD_WALKER: Yao = {
  id: 'cloud_walker',
  name: '云行者',
  rank: 'C',
  chapter: 'kunlun',
  hp: 42,
  artSrc: '/images/cloud_walker.jpg',
  intents: [
    { kind: 'attack', damage: 6, label: '⚔ 6' },
    { kind: 'cast', status: { kind: 'vulnerable', stack: 1 }, label: '✨ 易 1' },
    { kind: 'attack', damage: 9, label: '⚔ 9' },
  ],
  sealPattern: ['dot', 'horizontal', 'slash'],
  sealFormation: 'xuan',
  sealedCard: {
    name: '云步',
    type: 'yao', rarity: 'common', school: 'yuling', cost: 0,
    description: '抽 2 张牌。',
    flavor: '——昆仑在云上，云在昆仑上。',
    effects: [{ kind: 'draw', count: 2 }],
    silhouette: 'humanoid',
  },
  flavor: '昆仑在云上，云在昆仑上。',
  silhouette: 'humanoid',
  rewardCurrency: [11, 17],
};

export const YAO_PHOENIX_HATCHLING: Yao = {
  id: 'phoenix_hatchling',
  name: '雏凤',
  rank: 'B',
  chapter: 'kunlun',
  hp: 70,
  artSrc: '/images/phoenix_hatchling.jpg',
  intents: [
    { kind: 'attack', damage: 8, label: '⚔ 8' },
    { kind: 'cast', status: { kind: 'poison', stack: 2 }, label: '🩸 毒 2' },
    { kind: 'attack', damage: 12, label: '⚔ 12' },
    { kind: 'cast', status: { kind: 'vulnerable', stack: 1 }, label: '✨ 易 1' },
  ],
  sealPattern: ['loop', 'dot', 'slash', 'horizontal', 'hook'],
  sealFormation: 'hua',
  sealedCard: {
    name: '凤羽',
    type: 'yao', rarity: 'rare', school: 'zhanyao', cost: 1,
    description: '造成 8 点伤害，使敌易伤 1 层，回复 3 气血。',
    flavor: '——凤凰每五百年涅槃一次。它还没数到五。',
    effects: [
      { kind: 'damage', amount: 8 },
      { kind: 'applyStatus', status: 'vulnerable', stack: 1, target: 'enemy' },
      { kind: 'heal', amount: 3 },
    ],
    silhouette: 'bird',
  },
  flavor: '凤凰每五百年涅槃一次。它还没数到五。',
  silhouette: 'bird',
  rewardCurrency: [28, 38],
};

export const YAO_STAFF_SPIRIT: Yao = {
  id: 'staff_spirit',
  name: '杖灵',
  rank: 'C',
  chapter: 'kunlun',
  hp: 38,
  artSrc: '/images/staff_spirit.jpg',
  intents: [
    { kind: 'defend', block: 8, label: '🛡 8' },
    { kind: 'attack', damage: 5, label: '⚔ 5' },
    { kind: 'defend', block: 5, label: '🛡 5' },
  ],
  sealPattern: ['vertical', 'hook', 'dot'],
  sealFormation: 'ling',
  sealedCard: {
    name: '杖击',
    type: 'yao', rarity: 'common', school: 'zhanyao', cost: 1,
    description: '获得 6 气·御，造成 5 点伤害。',
    flavor: '——拄杖而来，一步一雷霆。',
    effects: [
      { kind: 'block', amount: 6 },
      { kind: 'damage', amount: 5 },
    ],
    silhouette: 'relic',
  },
  flavor: '拄杖而来，一步一雷霆。',
  silhouette: 'relic',
  rewardCurrency: [10, 15],
};

// ============================================================================
// 导出集合 + 查询
// ============================================================================
export const ALL_YAO: readonly Yao[] = [
  // Chapter 1
  YAO_QINGHU, YAO_YEHU, YAO_XIAOSHOU, YAO_CAOTOU_SHE, YAO_JIUWEI_ELITE, YAO_JIUWEI_BOSS,
  // Chapter 2
  YAO_TAOTIE_LORD, YAO_GOLD_EATER, YAO_DESIRE_GHOST, YAO_STONE_GUARDIAN, YAO_FURNACE_WRAITH,
  // Chapter 3
  YAO_SEA_EMPEROR, YAO_DEAD_SAILOR, YAO_PHANTOM_CRAB, YAO_SEA_SERPENT, YAO_WAVE_SPECTER,
  // Chapter 4
  YAO_KUNLUN_GUARDIAN, YAO_CELESTIAL_DEER, YAO_CLOUD_WALKER, YAO_PHOENIX_HATCHLING, YAO_STAFF_SPIRIT,
];

const yaoIndex: Record<string, Yao> = Object.fromEntries(ALL_YAO.map((y) => [y.id, y]));

export function getYao(id: string): Yao {
  const y = yaoIndex[id];
  if (!y) throw new Error(`Unknown yao id: ${id}`);
  return y;
}

export function yaoOfChapter(chapter: string): readonly Yao[] {
  return ALL_YAO.filter((y) => y.chapter === chapter);
}

export function yaoOfRank(rank: Yao['rank'], chapter?: string): readonly Yao[] {
  if (chapter) return ALL_YAO.filter((y) => y.rank === rank && y.chapter === chapter);
  return ALL_YAO.filter((y) => y.rank === rank);
}