/**
 * 基础战斗 AI · 仿真器用
 *
 * 策略：
 *   1. 手牌按"优先级"排序：
 *       a. 每回合优先攒到够抵挡的气·御（= 本回合敌攻击总和 × safetyRatio）
 *       b. 然后优先打伤害牌（含 execute）
 *       c. draw/gainEnergy 有正收益就打
 *   2. 出牌直到：能量不足 / 手牌无可打牌 / 回合超限
 *   3. 若遇 sealChoice：
 *       · 精英/Boss → 默认封（收集）
 *       · 普通妖   → 默认斩（省时）
 *
 * 目标：不做最优，做"合理普通玩家"。用于平衡仿真。
 */

import type { BattleState, Card, CardInstance, Intent } from '../types';
import { balance } from '../config/balance';
import {
  canPlay,
  chooseSeal,
  endTurn,
  intentOf,
  playCard,
  submitStroke,
} from './battle';
import type { RNG } from './rng';

// ============================================================================
// 估值
// ============================================================================
function expectedIncomingDamage(state: BattleState): number {
  let sum = 0;
  for (const e of state.enemies) {
    if (e.hp <= 0) continue;
    const intent = intentOf(e);
    if (!intent) continue;
    if (intent.kind === 'attack' && intent.damage) {
      sum += Math.round(
        intent.damage *
          (e.status.weak > 0 ? 0.75 : 1) *
          (state.playerStatus.vulnerable > 0 ? 1.25 : 1),
      );
    }
  }
  return sum;
}

type Score = { handIdx: number; score: number };

function scoreCard(state: BattleState, c: CardInstance, needBlock: number): number {
  let score = 0;
  for (const ef of c.effects ?? []) {
    switch (ef.kind) {
      case 'damage':
        score += ef.amount;
        break;
      case 'block':
        if (needBlock > 0) score += Math.min(ef.amount, needBlock + 2);
        else score += ef.amount * 0.3; // 盈余 block 降权
        break;
      case 'draw':
        score += ef.count * 4;
        break;
      case 'gainEnergy':
        score += ef.amount * 5;
        break;
      case 'applyStatus':
        if (ef.status === 'poison') score += ef.stack * 2;
        else if (ef.status === 'vulnerable') score += ef.stack * 4;
        else if (ef.status === 'weak') score += ef.stack * 3;
        break;
      case 'execute': {
        const target = state.enemies.find((e) => e.hp > 0);
        if (target && target.hp <= Math.ceil(target.maxHp * ef.hpPercent)) {
          score += ef.bonusDamage;
        }
        break;
      }
      case 'sealIntent':
        score += 6 * ef.turns;
        break;
      case 'discardEnemyBlock': {
        const target = state.enemies.find((e) => e.hp > 0);
        if (target) score += Math.min(target.block, 10);
        break;
      }
    }
  }
  // 费效价
  const perCost = c.cost <= 0 ? score + 2 : score / Math.max(1, c.cost);
  return perCost;
}

function bestAction(state: BattleState): Score | null {
  const needBlock = Math.max(0, expectedIncomingDamage(state) - state.playerBlock);
  let best: Score | null = null;
  for (let i = 0; i < state.hand.length; i++) {
    if (!canPlay(state, i)) continue;
    const s = scoreCard(state, state.hand[i], needBlock);
    if (s <= 0) continue;
    if (!best || s > best.score) best = { handIdx: i, score: s };
  }
  return best;
}

// ============================================================================
// 主循环
// ============================================================================
export interface AiOptions {
  /** 遇到封妖选择时：精英/Boss 默认封，普通默认斩 */
  sealPolicy?: 'auto' | 'alwaysKill' | 'alwaysSeal';
}

export function aiPlayTurn(
  state: BattleState,
  rng: RNG,
  opts: AiOptions = {},
): void {
  const policy = opts.sealPolicy ?? 'auto';
  let safety = balance.sim.maxActionsPerTurn;
  while (safety-- > 0) {
    if (state.phase === 'sealChoice') {
      const idx = state.enemies.findIndex((e) => e.sealChoiceTriggered && !e.sealed && e.hp > 0);
      const enemy = state.enemies[idx];
      let choice: 'kill' | 'seal' = 'kill';
      if (policy === 'alwaysSeal') choice = 'seal';
      else if (policy === 'alwaysKill') choice = 'kill';
      else if (enemy && (enemy.rank === 'B' || enemy.rank === 'S')) choice = 'seal';
      chooseSeal(state, idx, choice);
      continue;
    }
    if (state.phase === 'sealMiniGame') {
      // AI：总是完美完成拼符（相当于一个记了符谱的玩家）
      const ch = state.sealChallenge;
      if (!ch) break;
      const expected = ch.sequence[ch.progress];
      submitStroke(state, expected);
      continue;
    }
    if (state.phase !== 'playerAction') break;
    const action = bestAction(state);
    if (!action) break;
    playCard(state, action.handIdx, rng);
  }
  if (state.phase === 'playerAction') {
    endTurn(state, rng);
  }
}

/** 一整场自动战斗，直到 won/lost。返回胜负与回合数。 */
export function aiRunBattle(
  state: BattleState,
  rng: RNG,
  opts: AiOptions = {},
): { result: 'win' | 'lose'; turns: number } {
  let safety = 100;
  while (safety-- > 0) {
    if (state.phase === 'won' || state.phase === 'lost') break;
    aiPlayTurn(state, rng, opts);
  }
  return {
    result: state.phase === 'won' ? 'win' : 'lose',
    turns: state.turn,
  };
}

// Re-export types for convenience
export type { Card, Intent };
