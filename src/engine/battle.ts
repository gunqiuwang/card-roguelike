/**
 * 战斗引擎 · v0.2
 *
 * 对齐 docs/DESIGN_v0.2.md §1 / §4 / §5 / §6。
 *
 * 纯函数式 + 副作用隔离：
 *   · startBattle(yaoIds, playerHp, playerMaxHp, deck, rng, kind) → BattleState
 *   · playCard(state, handIdx, rng, targetIdx?) → void（原地修改）
 *   · endTurn(state, rng) → void
 *   · chooseSeal(state, enemyIdx, choice) → void   // 'kill' | 'seal' | 'cancel'
 *
 * 所有 RNG 使用都走 rng.ts，保证可复现。
 */

import type {
  BattleFx,
  BattlePhase,
  BattleState,
  Card,
  CardInstance,
  EnemyState,
  Effect,
  Intent,
  StatusBag,
  StatusKind,
  Yao,
  BattleOutcome,
} from '../types';
import { balance } from '../config/balance';
import { game } from '../config/game';
import { getYao } from '../data/yao';
import type { RNG } from './rng';

// ============================================================================
// 工具
// ============================================================================
let uidSeq = 0;
export function cardToInstance(c: Card): CardInstance {
  uidSeq++;
  return { ...c, uid: `${c.id}#${uidSeq}` };
}

export function emptyStatus(): StatusBag {
  return { poison: 0, weak: 0, vulnerable: 0, strength: 0, intentSealed: 0 };
}

function pushFx(state: BattleState, fx: Omit<BattleFx, 'id'>): void {
  state.fx.push({ ...fx, id: `fx-${Math.random().toString(36).slice(2, 8)}` });
}

function log(state: BattleState, s: string): void {
  state.log.push(s);
  if (state.log.length > 40) state.log.shift();
}

// ============================================================================
// 敌人创建
// ============================================================================
export function yaoToEnemy(yao: Yao, idx = 0): EnemyState {
  return {
    yaoId: yao.id,
    instanceId: `${yao.id}#${idx}`,
    name: yao.name,
    rank: yao.rank,
    hp: yao.hp,
    maxHp: yao.hp,
    block: 0,
    status: emptyStatus(),
    intentIndex: 0,
    intents: yao.intents.map((i) => ({ ...i })),
    silhouette: yao.silhouette,
    artSrc: yao.artSrc,
    sealedCard: yao.sealedCard,
    sealChoiceTriggered: false,
    sealed: false,
    flavor: yao.flavor,
    rewardCurrency: yao.rewardCurrency,
  };
}

// ============================================================================
// 战斗开始
// ============================================================================
export function startBattle(
  yaoIds: string[],
  playerHp: number,
  playerMaxHp: number,
  deck: Card[],
  rng: RNG,
  kind: BattleState['kind'] = 'normal',
): BattleState {
  const drawPile = rng.shuffle(deck.map(cardToInstance));
  const state: BattleState = {
    phase: 'battleStart',
    turn: 0,
    playerHp,
    playerMaxHp,
    playerBlock: 0,
    playerStatus: emptyStatus(),
    energy: balance.player.energyPerTurn,
    energyMax: balance.player.energyPerTurn,
    drawPile,
    hand: [],
    discardPile: [],
    exhaustPile: [],
    enemies: yaoIds.map((id, idx) => yaoToEnemy(getYao(id), idx)),
    log: [],
    fx: [],
    kind,
  };
  beginPlayerTurn(state, rng);
  return state;
}

// ============================================================================
// 回合开始
// ============================================================================
function beginPlayerTurn(state: BattleState, rng: RNG): void {
  state.turn += 1;
  state.phase = 'playerTurn';

  // block 归零（DESIGN §2.1）
  state.playerBlock = 0;

  // 能量重置
  state.energy = state.energyMax;

  // 毒伤
  if (state.playerStatus.poison > 0) {
    const dmg = state.playerStatus.poison;
    state.playerHp = Math.max(0, state.playerHp - dmg);
    pushFx(state, { target: 'player', kind: 'poison', value: dmg });
    log(state, `你承受 ${dmg} 点中毒伤害。`);
    state.playerStatus.poison = Math.max(0, state.playerStatus.poison - 1);
    if (state.playerHp <= 0) {
      state.phase = 'lost';
      finalizeOutcome(state);
      return;
    }
  }

  // 状态衰减（每回合 -1）
  decayPlayerStatus(state);

  // 抽手牌
  drawCards(state, balance.player.handSizePerTurn, rng);

  state.phase = 'playerAction';
}

function decayPlayerStatus(state: BattleState): void {
  const s = state.playerStatus;
  if (s.weak > 0) s.weak -= 1;
  if (s.vulnerable > 0) s.vulnerable -= 1;
  if (s.intentSealed > 0) s.intentSealed -= 1;
}

function decayEnemyStatus(e: EnemyState): void {
  const s = e.status;
  if (s.weak > 0) s.weak -= 1;
  if (s.vulnerable > 0) s.vulnerable -= 1;
  if (s.intentSealed > 0) s.intentSealed -= 1;
}

// ============================================================================
// 抽牌
// ============================================================================
export function drawCards(state: BattleState, n: number, rng: RNG): void {
  for (let i = 0; i < n; i++) {
    if (state.hand.length >= game.handSizeMax) break;
    if (state.drawPile.length === 0) {
      if (state.discardPile.length === 0) break;
      // 洗弃牌堆
      state.drawPile = rng.shuffle(state.discardPile);
      state.discardPile = [];
    }
    const c = state.drawPile.shift();
    if (c) state.hand.push(c);
  }
}

// ============================================================================
// 出牌
// ============================================================================
export function canPlay(state: BattleState, handIdx: number): boolean {
  if (state.phase !== 'playerAction') return false;
  const c = state.hand[handIdx];
  if (!c) return false;
  return state.energy >= c.cost;
}

/**
 * 主要玩家动作：出一张牌。
 * targetIdx 用于多敌场景（默认第 0 个存活敌人）。
 */
export function playCard(
  state: BattleState,
  handIdx: number,
  rng: RNG,
  targetIdxIn?: number,
): void {
  if (!canPlay(state, handIdx)) return;
  const c = state.hand[handIdx];
  const targetIdx = pickAliveEnemy(state, targetIdxIn);
  if (targetIdx < 0) return;

  // 扣能量
  state.energy -= c.cost;
  // 先从手牌移除（避免在 effect 中被误引用）
  state.hand.splice(handIdx, 1);

  log(state, `你打出【${c.name}】。`);

  // 执行效果
  for (const ef of c.effects ?? []) {
    applyEffect(state, ef, targetIdx, rng);
    // 每个 effect 后检查：若触发 SEAL_CHOICE 则暂停
    if (state.phase === 'sealChoice') {
      // 回放这张卡进入弃牌堆（本次出牌仍然算打了）
      state.discardPile.push(c);
      return;
    }
    // 若敌全灭 → 胜
    if (allEnemiesDefeated(state)) {
      state.discardPile.push(c);
      state.phase = 'won';
      finalizeOutcome(state);
      return;
    }
  }

  // 卡进堆
  if (c.exhaust) state.exhaustPile.push(c);
  else state.discardPile.push(c);
}

// ============================================================================
// Effect 执行器
// ============================================================================
function applyEffect(state: BattleState, ef: Effect, targetIdx: number, _rng: RNG): void {
  void _rng;
  switch (ef.kind) {
    case 'damage': {
      const enemy = state.enemies[targetIdx];
      if (!enemy || enemy.hp <= 0) return;
      dealDamageToEnemy(state, targetIdx, ef.amount);
      checkSealTrigger(state, targetIdx);
      return;
    }
    case 'block': {
      state.playerBlock += ef.amount;
      pushFx(state, { target: 'player', kind: 'block', value: ef.amount });
      return;
    }
    case 'draw': {
      drawCards(state, ef.count, _rng);
      return;
    }
    case 'gainEnergy': {
      state.energy += ef.amount;
      return;
    }
    case 'applyStatus': {
      if (ef.target === 'self') {
        applyStatusToPlayer(state, ef.status, ef.stack);
      } else {
        applyStatusToEnemy(state, targetIdx, ef.status, ef.stack);
      }
      return;
    }
    case 'execute': {
      const enemy = state.enemies[targetIdx];
      if (!enemy || enemy.hp <= 0) return;
      if (enemy.hp <= Math.ceil(enemy.maxHp * ef.hpPercent)) {
        dealDamageToEnemy(state, targetIdx, ef.bonusDamage);
        checkSealTrigger(state, targetIdx);
      }
      return;
    }
    case 'sealIntent': {
      const enemy = state.enemies[targetIdx];
      if (!enemy) return;
      enemy.status.intentSealed = Math.max(enemy.status.intentSealed, ef.turns);
      return;
    }
    case 'discardEnemyBlock': {
      const enemy = state.enemies[targetIdx];
      if (!enemy) return;
      enemy.block = 0;
      return;
    }
  }
}

// ============================================================================
// 伤害 / 状态 计算
// ============================================================================
function playerDamageMultiplier(state: BattleState): number {
  return state.playerStatus.weak > 0 ? 0.75 : 1.0;
}

function enemyDamageTakenMultiplier(enemy: EnemyState): number {
  return enemy.status.vulnerable > 0 ? 1.25 : 1.0;
}

function enemyAttackMultiplier(enemy: EnemyState): number {
  return enemy.status.weak > 0 ? 0.75 : 1.0;
}

function playerDamageTakenMultiplier(state: BattleState): number {
  return state.playerStatus.vulnerable > 0 ? 1.25 : 1.0;
}

function dealDamageToEnemy(state: BattleState, idx: number, base: number): void {
  const enemy = state.enemies[idx];
  if (!enemy || enemy.hp <= 0) return;
  const raw = Math.round(
    base * playerDamageMultiplier(state) * enemyDamageTakenMultiplier(enemy),
  );
  const afterBlock = Math.max(0, raw - enemy.block);
  enemy.block = Math.max(0, enemy.block - raw);
  enemy.hp = Math.max(0, enemy.hp - afterBlock);
  pushFx(state, {
    target: 'enemy',
    enemyIdx: idx,
    kind: raw >= 12 ? 'crit' : 'damage',
    value: afterBlock,
  });
  log(state, `${enemy.name} 受 ${afterBlock} 点伤害。`);
}

function dealDamageToPlayer(state: BattleState, attacker: EnemyState, base: number): void {
  const raw = Math.round(
    base * enemyAttackMultiplier(attacker) * playerDamageTakenMultiplier(state)
      + (attacker.status.strength ?? 0),
  );
  const afterBlock = Math.max(0, raw - state.playerBlock);
  state.playerBlock = Math.max(0, state.playerBlock - raw);
  state.playerHp = Math.max(0, state.playerHp - afterBlock);
  pushFx(state, { target: 'player', kind: 'damage', value: afterBlock });
  log(state, `你被 ${attacker.name} 造成 ${afterBlock} 点伤害。`);
}

function applyStatusToEnemy(
  state: BattleState,
  idx: number,
  kind: StatusKind,
  stack: number,
): void {
  const enemy = state.enemies[idx];
  if (!enemy || enemy.hp <= 0) return;
  enemy.status[kind] += stack;
}

function applyStatusToPlayer(state: BattleState, kind: StatusKind, stack: number): void {
  state.playerStatus[kind] += stack;
}

// ============================================================================
// SEAL 触发
// ============================================================================
function checkSealTrigger(state: BattleState, idx: number): void {
  const enemy = state.enemies[idx];
  if (!enemy) return;
  if (enemy.hp <= 0) return; // 已死（斩）
  if (enemy.sealChoiceTriggered) return;
  if (enemy.hp <= enemy.maxHp * balance.seal.thresholdHpPercent) {
    enemy.sealChoiceTriggered = true;
    state.phase = 'sealChoice';
    log(state, `${enemy.name} 血气衰竭，镇妖印浮现。【斩】 / 【封】？`);
    pushFx(state, { target: 'enemy', enemyIdx: idx, kind: 'seal', value: '印' });
  }
}

/** 玩家做出选择 */
export function chooseSeal(
  state: BattleState,
  enemyIdx: number,
  choice: 'kill' | 'seal',
): void {
  if (state.phase !== 'sealChoice') return;
  const enemy = state.enemies[enemyIdx];
  if (!enemy) return;
  if (choice === 'kill') {
    enemy.hp = 0;
    log(state, `你选择【斩】了 ${enemy.name}。`);
  } else {
    enemy.hp = 0;
    enemy.sealed = true;
    log(state, `你选择【封】了 ${enemy.name}。妖卡归入弃牌堆。`);
  }
  // 恢复推进
  if (allEnemiesDefeated(state)) {
    state.phase = 'won';
    finalizeOutcome(state);
  } else {
    state.phase = 'playerAction';
  }
}

// ============================================================================
// 结束回合 / 敌方回合
// ============================================================================
export function endTurn(state: BattleState, rng: RNG): void {
  if (state.phase !== 'playerAction') return;
  // 玩家毒（回合结束也吃？—— 按 DESIGN 是回合开始吃，这里不再）
  // 放弃手牌（v0.2 设计是保留，按 DESIGN §1.2）
  state.phase = 'enemyTurn';

  for (let i = 0; i < state.enemies.length; i++) {
    const e = state.enemies[i];
    if (!e || e.hp <= 0) continue;
    executeEnemyIntent(state, e);
    if (state.playerHp <= 0) {
      state.phase = 'lost';
      finalizeOutcome(state);
      return;
    }
  }
  // 敌人回合末：状态衰减 + 中毒 + block 归零（为下回合）
  for (const e of state.enemies) {
    if (e.hp <= 0) continue;
    e.block = 0;
    // 中毒结算
    if (e.status.poison > 0) {
      const dmg = e.status.poison;
      const afterBlock = dmg; // 已在敌 block=0 之后
      e.hp = Math.max(0, e.hp - afterBlock);
      pushFx(state, { target: 'enemy', enemyIdx: state.enemies.indexOf(e), kind: 'poison', value: dmg });
      log(state, `${e.name} 中毒 ${dmg}。`);
      e.status.poison = Math.max(0, e.status.poison - 1);
      if (e.hp > 0) {
        // 未死，但 HP 或许触发 seal
        checkSealTrigger(state, state.enemies.indexOf(e));
        if ((state.phase as BattlePhase) === 'sealChoice') {
          // 毒入 seal 门槛时，战斗暂停让玩家选
          return;
        }
      }
    }
    decayEnemyStatus(e);
    // 下一意图
    e.intentIndex = (e.intentIndex + 1) % e.intents.length;
  }

  if (allEnemiesDefeated(state)) {
    state.phase = 'won';
    finalizeOutcome(state);
    return;
  }

  beginPlayerTurn(state, rng);
}

function currentIntent(e: EnemyState): Intent {
  return e.intents[e.intentIndex];
}

function executeEnemyIntent(state: BattleState, e: EnemyState): void {
  if (e.status.intentSealed > 0) {
    log(state, `${e.name} 的意图被封。`);
    return;
  }
  const intent = currentIntent(e);
  switch (intent.kind) {
    case 'attack': {
      if (intent.damage) dealDamageToPlayer(state, e, intent.damage);
      if (intent.status) applyStatusToPlayer(state, intent.status.kind, intent.status.stack);
      return;
    }
    case 'defend': {
      if (intent.block) e.block += intent.block;
      pushFx(state, { target: 'enemy', enemyIdx: state.enemies.indexOf(e), kind: 'block', value: intent.block ?? 0 });
      return;
    }
    case 'charge': {
      // 蓄力：纯前摇，不造成伤害
      return;
    }
    case 'cast': {
      if (intent.status) {
        applyStatusToPlayer(state, intent.status.kind, intent.status.stack);
        log(state, `${e.name} 施法，对你施加 ${intent.status.kind}。`);
      }
      return;
    }
  }
}

// ============================================================================
// 终盘
// ============================================================================
export function allEnemiesDefeated(state: BattleState): boolean {
  return state.enemies.every((e) => e.hp <= 0);
}

function pickAliveEnemy(state: BattleState, pref?: number): number {
  if (pref !== undefined && state.enemies[pref] && state.enemies[pref].hp > 0) return pref;
  return state.enemies.findIndex((e) => e.hp > 0);
}

function finalizeOutcome(state: BattleState): void {
  if (state.phase !== 'won' && state.phase !== 'lost') return;
  const outcome: BattleOutcome = {
    result: state.phase === 'won' ? 'win' : 'lose',
    currencyGained: 0,
    sealedCards: [],
    shouldOfferReward: false,
  };
  if (state.phase === 'won') {
    let anyKilled = false;
    let anySealed = false;
    for (const e of state.enemies) {
      if (e.sealed) {
        anySealed = true;
        outcome.currencyGained += Math.floor(
          (e.rewardCurrency[0] + e.rewardCurrency[1]) / 2 * balance.seal.currencyRatio,
        );
        outcome.sealedCards.push({
          ...e.sealedCard,
          id: `yao_${e.yaoId}_${Date.now()}_${outcome.sealedCards.length}`,
        });
      } else {
        anyKilled = true;
        // 随机区间
        const [lo, hi] = e.rewardCurrency;
        outcome.currencyGained += Math.floor((lo + hi) / 2);
      }
    }
    outcome.resolution = anySealed && anyKilled ? 'mixed' : anySealed ? 'seal' : 'kill';
    // 至少一只被斩 → 给卡牌奖励；全封 → 不给
    outcome.shouldOfferReward = anyKilled;
  }
  state.outcome = outcome;
}

// ============================================================================
// 意图公示（UI 辅助）
// ============================================================================
export function intentOf(e: EnemyState): Intent | null {
  if (e.hp <= 0) return null;
  if (e.status.intentSealed > 0) {
    return { kind: 'cast', label: '· 空 过 ·' };
  }
  return currentIntent(e);
}

// ============================================================================
// 暴露 BattlePhase 用于导出便利
// ============================================================================
export type { BattlePhase };
