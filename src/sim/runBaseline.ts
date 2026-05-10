/**
 * 仿真器 · Baseline
 *
 * 跑 N 局（AI 控制），输出胜率 / 平均回合数 / 平均残血 / 平均封妖数。
 *
 * 用法（开发者控制台）：
 *   node --experimental-strip-types src/sim/runBaseline.ts
 * 或者使用 esbuild 打包后在 node 里跑（见 scripts/sim.mjs）。
 *
 * 注意：本文件不能依赖 DOM / React。只可用纯 TS + engine/ + data/.
 */

import { createRng, aiRunBattle, startBattle } from '../engine';
import type { BattleState } from '../types';
import {
  createRun,
  currentNode,
  enterNode,
  resolveBattle,
  takeReward,
  resolveOverflow,
  resolveEventChoice,
  dismissEvent,
  shrineAct,
  leaveShrine,
  runFinished,
} from '../engine/run';
import type { RunState } from '../types';

export interface SimResult {
  runs: number;
  wins: number;
  winRate: number;
  avgTurns: number;
  avgWinnerHpPct: number;
  avgSeals: number;
  avgKills: number;
  avgCardsAdded: number;
  boss: {
    reached: number;
    winsAtBoss: number;
  };
}

/** 单个 run 的 AI 回放（与战斗 AI 配合）。返回 run stats。 */
export function simulateRun(seed: number): {
  won: boolean;
  hpPct: number;
  turns: number;
  seals: number;
  kills: number;
  cardsAdded: number;
  reachedBoss: boolean;
} {
  const run = createRun(seed);
  const startDeckSize = run.deck.length;
  const globalRng = createRng(seed ^ 0xdeadbeef);
  let reachedBoss = false;

  let safety = 50;
  while (safety-- > 0) {
    if (runFinished(run) !== null) break;
    const node = currentNode(run);
    if (!node) break;

    // === 进入节点 ===
    if (node.kind === 'battle' || node.kind === 'elite' || node.kind === 'boss') {
      if (node.kind === 'boss') reachedBoss = true;
      enterNode(run, globalRng);
      if (!run.battle) break;
      // 跑战斗
      const b: BattleState = run.battle;
      const { result } = aiRunBattle(b, globalRng, { sealPolicy: 'auto' });
      resolveBattle(run, globalRng);
      if (result === 'lose') break;
      // 奖励
      if (run.pendingReward) {
        // AI：选伤害数值最高的牌；若没有合适就随机
        const choices = run.pendingReward.cardChoices;
        if (choices.length > 0) {
          const idx = pickBestRewardIdx(choices);
          takeReward(run, idx);
        } else {
          takeReward(run, 'skip');
        }
      }
      // 可能溢出
      if (run.pendingOverflow) {
        // 优先删 starter 里的镇魂符（复数），再是其他
        const remIdx = pickDeletableIdx(run);
        resolveOverflow(run, remIdx);
      }
    } else if (node.kind === 'event') {
      enterNode(run, globalRng);
      if (run.pendingEvent) {
        // AI: 按事件 id 选一个"好处明显"的
        const eid = run.pendingEvent.eventId;
        const choice = eventChoiceFor(eid);
        resolveEventChoice(run, choice, globalRng);
        dismissEvent(run);
        if (run.pendingOverflow) {
          const remIdx = pickDeletableIdx(run);
          resolveOverflow(run, remIdx);
        }
      }
    } else if (node.kind === 'shrine') {
      // AI：有灵气就升级首张攻击牌；否则静修；再否则 leave
      if (run.currency >= 30) {
        const idx = pickUpgradeTargetIdx(run);
        if (idx >= 0) shrineAct(run, { kind: 'upgrade', cardIdx: idx });
        else shrineAct(run, { kind: 'rest' });
      } else if (run.hp < run.maxHp - 5) {
        shrineAct(run, { kind: 'rest' });
      }
      leaveShrine(run);
    } else {
      break;
    }
  }

  const fin = runFinished(run);
  return {
    won: fin === 'victory',
    hpPct: run.maxHp > 0 ? run.hp / run.maxHp : 0,
    turns: run.stats.turnsPlayed,
    seals: run.stats.seals,
    kills: run.stats.kills,
    cardsAdded: run.deck.length - startDeckSize,
    reachedBoss,
  };
}

// ============================================================================
// AI 的辅助决策
// ============================================================================
function pickBestRewardIdx(choices: { id: string; effects?: unknown[] }[]): number {
  // 粗略估值：含 damage/多次效果的优先；其次含 vulnerable；再次 draw
  const scores = choices.map((c) => {
    const efs = (c as { effects?: Array<Record<string, unknown>> }).effects ?? [];
    let s = 0;
    for (const e of efs) {
      if (e.kind === 'damage') s += (e.amount as number) * 1.2;
      if (e.kind === 'block') s += (e.amount as number) * 0.8;
      if (e.kind === 'draw') s += (e.count as number) * 4;
      if (e.kind === 'gainEnergy') s += (e.amount as number) * 6;
      if (e.kind === 'applyStatus' && e.status === 'vulnerable') s += (e.stack as number) * 5;
      if (e.kind === 'applyStatus' && e.status === 'poison') s += (e.stack as number) * 2;
      if (e.kind === 'discardEnemyBlock') s += 4;
    }
    return s;
  });
  let best = 0;
  for (let i = 1; i < scores.length; i++) if (scores[i] > scores[best]) best = i;
  return best;
}

function pickUpgradeTargetIdx(run: RunState): number {
  // 优先升 damage 牌
  for (let i = 0; i < run.deck.length; i++) {
    const c = run.deck[i];
    if (c.effects?.some((e) => e.kind === 'damage')) return i;
  }
  // 否则升第一张
  return run.deck.length > 0 ? 0 : -1;
}

function pickDeletableIdx(run: RunState): number {
  // 优先删 starter 镇魂符 / 抽符（太多的话）
  for (let i = 0; i < run.deck.length; i++) {
    if (run.deck[i].id === 'fu_soul_seal') return i;
  }
  return 0;
}

function eventChoiceFor(eid: string): number {
  // 极简策略：永远挑第 0（通常是"好处明显"的斩/取）
  if (eid === 'peddler') return 1; // 不买（避免 HP 风险）
  return 0;
}

// ============================================================================
// 批量仿真
// ============================================================================
export function runBaseline(count = 1000, seedBase = 1): SimResult {
  let wins = 0;
  let totalTurns = 0;
  let totalHpPct = 0;
  let totalSeals = 0;
  let totalKills = 0;
  let totalCards = 0;
  let reachedBoss = 0;
  let winsAtBoss = 0;

  for (let i = 0; i < count; i++) {
    const r = simulateRun(seedBase + i);
    if (r.won) {
      wins++;
      totalHpPct += r.hpPct;
    }
    totalTurns += r.turns;
    totalSeals += r.seals;
    totalKills += r.kills;
    totalCards += r.cardsAdded;
    if (r.reachedBoss) reachedBoss++;
    if (r.reachedBoss && r.won) winsAtBoss++;
  }

  return {
    runs: count,
    wins,
    winRate: wins / count,
    avgTurns: totalTurns / count,
    avgWinnerHpPct: wins > 0 ? totalHpPct / wins : 0,
    avgSeals: totalSeals / count,
    avgKills: totalKills / count,
    avgCardsAdded: totalCards / count,
    boss: { reached: reachedBoss, winsAtBoss },
  };
}

/** 单战斗仿真（用于 L1 单卡 / L4 节奏分析）。 */
export function simulateSingleBattle(
  yaoIds: string[],
  deck: import('../types').Card[],
  playerHp: number,
  playerMaxHp: number,
  seed: number,
  kind: BattleState['kind'] = 'normal',
): { win: boolean; turns: number; hpPct: number; enemyHpLeft: number } {
  const rng = createRng(seed);
  const b = startBattle(yaoIds, playerHp, playerMaxHp, deck, rng, kind);
  const { result, turns } = aiRunBattle(b, rng, { sealPolicy: 'alwaysKill' });
  const enemyHpLeft = b.enemies.reduce((s, e) => s + Math.max(0, e.hp), 0);
  return {
    win: result === 'win',
    turns,
    hpPct: playerMaxHp > 0 ? b.playerHp / playerMaxHp : 0,
    enemyHpLeft,
  };
}

// ============================================================================
// CLI 入口（Node 环境）
// ============================================================================
// 使用 globalThis 判断是否在 Node 下直接运行
declare const process: { argv: string[] } | undefined;

function formatResult(r: SimResult): string {
  const pct = (n: number) => (n * 100).toFixed(1) + '%';
  return [
    `Runs        : ${r.runs}`,
    `Wins        : ${r.wins} (${pct(r.winRate)})`,
    `Avg turns   : ${r.avgTurns.toFixed(2)}`,
    `Winner HP % : ${pct(r.avgWinnerHpPct)}`,
    `Avg seals   : ${r.avgSeals.toFixed(2)}`,
    `Avg kills   : ${r.avgKills.toFixed(2)}`,
    `Cards added : ${r.avgCardsAdded.toFixed(2)}`,
    `Reached boss: ${r.boss.reached} / wins ${r.boss.winsAtBoss}`,
  ].join('\n');
}

// 通过 globalThis 检测 node 环境，避免类型依赖
if (typeof process !== 'undefined' && typeof process.argv !== 'undefined') {
  const argv = process.argv;
  if (argv.length >= 2 && argv[1] && argv[1].endsWith('runBaseline.js')) {
    const count = argv[2] ? parseInt(argv[2], 10) : 200;
    const seed = argv[3] ? parseInt(argv[3], 10) : 42;
    const r = runBaseline(count, seed);
    // eslint-disable-next-line no-console
    console.log(formatResult(r));
  }
}
