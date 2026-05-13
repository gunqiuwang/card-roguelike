/**
 * 国际化系统 · v1.0
 * 支持：中 / 英
 *
 * 使用方式：
 *   t('card.fire_strike')  // 中文
 *   setLocale('en'); t('card.fire_strike')  // 英文
 */

export type Locale = 'zh' | 'en';

const translations: Record<string, Record<Locale, string>> = {
  // =================================================================
  // 通用
  // =================================================================
  'common.back':        { zh: '返回', en: 'Back' },
  'common.skip':        { zh: '跳过', en: 'Skip' },
  'common.confirm':    { zh: '确认', en: 'Confirm' },
  'common.cancel':      { zh: '取消', en: 'Cancel' },
  'common.continue':    { zh: '继续', en: 'Continue' },
  'common.close':      { zh: '关闭', en: 'Close' },

  // =================================================================
  // 屏幕标题
  // =================================================================
  'screen.title':      { zh: '山海志·封妖录', en: 'Shan Hai Zhi' },
  'screen.newGame':    { zh: '开始新游戏', en: 'New Game' },
  'screen.continue_':   { zh: '继续游戏', en: 'Continue' },
  'screen.codex':      { zh: '妖物图鉴', en: 'Codex' },
  'screen.styleguide': { zh: '设计规范', en: 'Style Guide' },
  'screen.victory':    { zh: '通关', en: 'Victory' },
  'screen.gameOver':   { zh: '败北', en: 'Defeated' },

  // =================================================================
  // 职业
  // =================================================================
  'class.fangshi':    { zh: '方士', en: 'Sorcerer' },
  'class.yinyang':     { zh: '阴阳师', en: 'Yin-Yang Master' },

  // =================================================================
  // 章节
  // =================================================================
  'chapter.qingqiu':   { zh: '青丘残岭', en: 'Qingqiu Wastes' },
  'chapter.taotie':    { zh: '饕餮古镇', en: 'Taotie Town' },
  'chapter.guixu':     { zh: '归墟冥海', en: 'Guixu Sea' },
  'chapter.kunlun':    { zh: '昆仑仙境', en: 'Kunlun Realm' },

  // =================================================================
  // 卡牌
  // =================================================================
  'card.fu_fire_strike': { zh: '烈焰符', en: 'Fire Strike' },
  'card.fu_soul_seal':   { zh: '镇魂符', en: 'Soul Seal' },
  'card.zhan_tao_sword': { zh: '桃木斩', en: 'Peach Sword' },
  'card.fu_draw':        { zh: '抽符', en: 'Draw' },
  'card.ult_taiji':      { zh: '太极归一', en: 'Taiji Unity' },

  // =================================================================
  // 状态
  // =================================================================
  'status.poison':     { zh: '毒', en: 'Poison' },
  'status.weak':       { zh: '虚', en: 'Weak' },
  'status.vulnerable': { zh: '易', en: 'Vulnerable' },
  'status.strength':   { zh: '力', en: 'Strength' },

  // =================================================================
  // 战斗
  // =================================================================
  'battle.turn':       { zh: '回合', en: 'Turn' },
  'battle.endTurn':    { zh: '结束回合', en: 'End Turn' },
  'battle.sealChoice': { zh: '斩 / 封 ?', en: 'Kill / Seal ?' },
  'battle.seal':      { zh: '封', en: 'Seal' },
  'battle.kill':      { zh: '斩', en: 'Kill' },
  'battle.taiji':     { zh: '太极归一', en: 'Taiji Unity' },
};

let currentLocale: Locale = 'zh';

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  localStorage.setItem('shanhai.locale', locale);
}

export function getLocale(): Locale {
  return currentLocale;
}

export function initLocale(): void {
  const saved = localStorage.getItem('shanhai.locale') as Locale | null;
  if (saved === 'zh' || saved === 'en') currentLocale = saved;
}

export function t(key: string, fallback?: string): string {
  const entry = translations[key];
  if (!entry) return fallback ?? key;
  return entry[currentLocale] ?? entry.zh;
}

export function tc(key: string, count: number): string {
  const entry = translations[key];
  if (!entry) return key;
  const base = entry[currentLocale] ?? entry.zh;
  // 中文用"张"，英文用""，简单处理
  if (currentLocale === 'zh') return `${count}${base}`;
  return `${count} ${base}`;
}