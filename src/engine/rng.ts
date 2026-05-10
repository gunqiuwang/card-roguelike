/**
 * 可复现 RNG · Mulberry32（单 32 位状态，够用且快）
 *
 * 为什么自带而不是 Math.random：
 *   · 仿真器要可复现（同 seed → 同结果）
 *   · 存档里记录 seed，Debug 能重放
 */

export interface RNG {
  /** [0, 1) */
  next: () => number;
  /** [lo, hi]（含上下界） */
  int: (lo: number, hi: number) => number;
  /** 从数组中随机抽一个 */
  pick: <T>(arr: readonly T[]) => T;
  /** 原地洗牌（Fisher-Yates） */
  shuffle: <T>(arr: T[]) => T[];
  /** 按权重对象抽 key */
  weightedPick: <K extends string>(weights: Record<K, number>) => K;
  /** 当前 seed（用于 debug） */
  seed: number;
}

export function createRng(seed: number): RNG {
  let state = seed | 0 || 0x9e3779b9; // 避免 0

  function next(): number {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function int(lo: number, hi: number): number {
    return Math.floor(next() * (hi - lo + 1)) + lo;
  }

  function pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) throw new Error('pick: empty array');
    return arr[Math.floor(next() * arr.length)];
  }

  function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function weightedPick<K extends string>(weights: Record<K, number>): K {
    const entries = Object.entries(weights) as [K, number][];
    const total = entries.reduce((s, [, w]) => s + w, 0);
    if (total <= 0) throw new Error('weightedPick: total weight must be > 0');
    let r = next() * total;
    for (const [k, w] of entries) {
      r -= w;
      if (r <= 0) return k;
    }
    return entries[entries.length - 1][0];
  }

  return { next, int, pick, shuffle, weightedPick, seed };
}

/** 默认全局 RNG（UI 用，非仿真） */
export function createDefaultRng(): RNG {
  return createRng(Date.now() & 0xffffffff);
}
