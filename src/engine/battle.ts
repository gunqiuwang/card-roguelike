/**
 * 战斗引擎 · v0.2.1
 *
 * 新增（相对 v0.2）：
 *   · 妖性系统（妖卡打出 +5；依阈值自残/弃牌）
 *   · 拼符封印挑战（phase 'sealMiniGame'，笔画序列）
 *   · Boss 蓄力可被打断（HP ≤ interruptHpPercent 清空当前 charge）
 *   · 秘卷效应（startBlock / extraEnergy / extraDraw / lowHpDamage / firstHitBonus）
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
  StrokeKind,
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
  return { ...c, uid: `${c.id}#${uidSeq}`, yaoxing: c.yaoxing };
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

function hasScroll(state: BattleState, id: string): boolean {
  return !!state.activeScrolls?.includes(id);
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
    sealedPerfect: false,
    sealPattern: yao.sealPattern ? [...yao.sealPattern] : generateSealPattern(yao.rank),
    chargeInterrupted: false,
    flavor: yao.flavor,
    rewardCurrency: yao.rewardCurrency,
  };
}

/** 未指定符阵时按 rank 动态生成 */
function generateSealPattern(rank: 'C' | 'B' | 'S'): StrokeKind[] {
  const len = balance.seal.patternLength[rank];
  const pool: StrokeKind[] = ['dot', 'horizontal', 'vertical', 'slash', 'hook', 'loop'];
  const pattern: StrokeKind[] = [];
  for (let i = 0; i < len; i++) {
    pattern.push(pool[i % pool.length]);
  }
  return pattern;
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
  scrolls: string[] = [],
): BattleState {
  const drawPile = rng.shuffle(deck.map(cardToInstance));

  // 秘卷 · 能量 / 起手御
  let energyMax = balance.player.energyPerTurn;
  let startBlock = 0;
  if (scrolls.includes('scroll_concentration')) energyMax += 1;
  if (scrolls.includes('scroll_shield')) startBlock = 6;

  const state: BattleState = {
    phase: 'battleStart',
    turn: 0,
    playerHp,
    playerMaxHp,
    playerBlock: startBlock,
    playerStatus: emptyStatus(),
    energy: energyMax,
    energyMax,
    drawPile,
    hand: [],
    discardPile: [],
    exhaustPile: [],
    enemies: yaoIds.map((id, idx) => yaoToEnemy(getYao(id), idx)),
    log: [],
    fx: [],
    kind,
    activeScrolls: [...scrolls],
    firstDamageCardUsed: false,
    sealChallenge: null,
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

  // block 归零（DESIGN §2.1）——起手回合例外保留 startBlock
  if (state.turn > 1) state.playerBlock = 0;

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

  // 妖性 · 噬主卡（yaoxing >= 90）每回合自残 5
  let ownHarm = 0;
  for (const c of [...state.hand, ...state.drawPile, ...state.discardPile]) {
    if (c.type === 'yao' && (c.yaoxing ?? 0) >= balance.yaoxing.frenzy) {
      ownHarm += balance.yaoxing.selfHarmOwn;
    }
  }
  if (ownHarm > 0) {
    state.playerHp = Math.max(0, state.playerHp - ownHarm);
    pushFx(state, { target: 'player', kind: 'damage', value: ownHarm });
    log(state, `噬主妖卡反噬，你损 ${ownHarm} 气血。`);
    if (state.playerHp <= 0) {
      state.phase = 'lost';
      finalizeOutcome(state);
      return;
    }
  }

  // 状态衰减
  decayPlayerStatus(state);

  // 抽手牌 · 秘卷 extraDraw +1
  const draw = balance.player.handSizePerTurn + (hasScroll(state, 'scroll_insight') ? 1 : 0);
  drawCards(state, draw, rng);

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
  // 妖性 ≥ 90 · 噬主 · 不可打出
  if (c.type === 'yao' && (c.yaoxing ?? 0) >= balance.yaoxing.frenzy) return false;
  return state.energy >= c.cost;
}

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

  // 扣能量 + 移手牌
  state.energy -= c.cost;
  state.hand.splice(handIdx, 1);

  log(state, `你打出【${c.name}】。`);

  // 妖性结算 · 打出前先算副作用
  if (c.type === 'yao') {
    applyYaoxingOnPlay(state, c, rng);
    if (state.playerHp <= 0) {
      // 噬主/狂乱自残致死
      state.discardPile.push(c);
      state.phase = 'lost';
      finalizeOutcome(state);
      return;
    }
  }

  // 执行效果
  let hasDamage = false;
  for (const ef of c.effects ?? []) {
    if (ef.kind === 'damage' || ef.kind === 'execute') hasDamage = true;
    applyEffect(state, ef, targetIdx, rng, c);
    if (state.phase === 'sealChoice') {
      state.discardPile.push(c);
      return;
    }
    if (allEnemiesDefeated(state)) {
      state.discardPile.push(c);
      state.phase = 'won';
      finalizeOutcome(state);
      return;
    }
  }
  if (hasDamage && !state.firstDamageCardUsed) state.firstDamageCardUsed = true;

  if (c.exhaust) state.exhaustPile.push(c);
  else state.discardPile.push(c);
}

/** 打出妖卡 · 涨妖性 + 触发阈值副作用 */
function applyYaoxingOnPlay(state: BattleState, card: CardInstance, rng: RNG): void {
  const resist = hasScroll(state, 'scroll_calm') ? 0.5 : 1;
  const before = card.yaoxing ?? 0;
  const inc = Math.round(balance.yaoxing.perPlay * resist);
  card.yaoxing = Math.min(100, before + inc);
  const lv = card.yaoxing;

  if (lv >= balance.yaoxing.frenzy) {
    // 狂乱：必自残 + 25% 丢弃一张手牌
    state.playerHp = Math.max(0, state.playerHp - balance.yaoxing.selfHarmFrenzy);
    pushFx(state, { target: 'player', kind: 'damage', value: balance.yaoxing.selfHarmFrenzy });
    log(state, `【${card.name}】狂乱！你自残 ${balance.yaoxing.selfHarmFrenzy}。`);
    if (rng.next() < balance.yaoxing.frenzyDiscardProc && state.hand.length > 0) {
      const i = rng.int(0, state.hand.length - 1);
      const dropped = state.hand.splice(i, 1)[0];
      if (dropped) {
        state.discardPile.push(dropped);
        log(state, `妖气震荡，手中【${dropped.name}】跌入弃牌堆。`);
      }
    }
  } else if (lv >= balance.yaoxing.restless) {
    // 躁动：10% 自残 3
    if (rng.next() < balance.yaoxing.restlessProc) {
      state.playerHp = Math.max(0, state.playerHp - balance.yaoxing.selfHarmRestless);
      pushFx(state, { target: 'player', kind: 'damage', value: balance.yaoxing.selfHarmRestless });
      log(state, `【${card.name}】躁动，反咬你 ${balance.yaoxing.selfHarmRestless} 点。`);
    }
  }
}

// ============================================================================
// Effect 执行器
// ============================================================================
function applyEffect(
  state: BattleState,
  ef: Effect,
  targetIdx: number,
  rng: RNG,
  sourceCard?: CardInstance,
): void {
  switch (ef.kind) {
    case 'damage': {
      const enemy = state.enemies[targetIdx];
      if (!enemy || enemy.hp <= 0) return;
      let amt = ef.amount;
      // 秘卷 · 奋血卷
      if (hasScroll(state, 'scroll_desperate') && state.playerHp <= state.playerMaxHp * 0.3) {
        amt = Math.round(amt * 1.3);
      }
      // 秘卷 · 先手卷（本战首张伤害卡）
      if (hasScroll(state, 'scroll_firststrike') && !state.firstDamageCardUsed) {
        amt = Math.round(amt * 1.5);
      }
      void sourceCard;
      dealDamageToEnemy(state, targetIdx, amt);
      checkSealTrigger(state, targetIdx);
      // 打断蓄力
      checkChargeInterrupt(state, targetIdx);
      return;
    }
    case 'block': {
      state.playerBlock += ef.amount;
      pushFx(state, { target: 'player', kind: 'block', value: ef.amount });
      return;
    }
    case 'draw': {
      drawCards(state, ef.count, rng);
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
        checkChargeInterrupt(state, targetIdx);
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
// 伤害 / 状态
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
  const raw = Math.round(base * playerDamageMultiplier(state) * enemyDamageTakenMultiplier(enemy));
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
    base * enemyAttackMultiplier(attacker) * playerDamageTakenMultiplier(state) +
      (attacker.status.strength ?? 0),
  );
  const afterBlock = Math.max(0, raw - state.playerBlock);
  state.playerBlock = Math.max(0, state.playerBlock - raw);
  state.playerHp = Math.max(0, state.playerHp - afterBlock);
  pushFx(state, { target: 'player', kind: 'damage', value: afterBlock });
  log(state, `你被 ${attacker.name} 造成 ${afterBlock} 点伤害。`);
}

function applyStatusToEnemy(state: BattleState, idx: number, kind: StatusKind, stack: number): void {
  const enemy = state.enemies[idx];
  if (!enemy || enemy.hp <= 0) return;
  enemy.status[kind] += stack;
}
function applyStatusToPlayer(state: BattleState, kind: StatusKind, stack: number): void {
  state.playerStatus[kind] += stack;
}

// ============================================================================
// Boss 蓄力打断（v0.2.1）
// ============================================================================
function checkChargeInterrupt(state: BattleState, idx: number): void {
  const enemy = state.enemies[idx];
  if (!enemy || enemy.hp <= 0) return;
  if (enemy.chargeInterrupted) return;
  const yao = getYao(enemy.yaoId);
  if (yao.interruptHpPercent === undefined) return;
  if (enemy.hp > enemy.maxHp * yao.interruptHpPercent) return;
  // 当前意图是 charge 或下一意图是 climax → 打断
  const cur = enemy.intents[enemy.intentIndex];
  if (cur?.kind === 'charge') {
    enemy.chargeInterrupted = true;
    // 跳到蓄力大招之后
    const climax = yao.chargeClimaxIndex ?? enemy.intents.length - 1;
    enemy.intentIndex = (climax + 1) % enemy.intents.length;
    log(state, `✦ ${enemy.name} 的蓄力被打断！大招落空。`);
    pushFx(state, { target: 'enemy', enemyIdx: idx, kind: 'seal', value: '断' });
  }
}

// ============================================================================
// SEAL 选择（点【封】后进入 sealMiniGame；【斩】直接杀）
// ============================================================================
function checkSealTrigger(state: BattleState, idx: number): void {
  const enemy = state.enemies[idx];
  if (!enemy) return;
  if (enemy.hp <= 0) return;
  if (enemy.sealChoiceTriggered) return;
  if (enemy.hp <= enemy.maxHp * balance.seal.thresholdHpPercent) {
    enemy.sealChoiceTriggered = true;
    state.phase = 'sealChoice';
    log(state, `${enemy.name} 血气衰竭，镇妖印浮现。【斩】 / 【封】？`);
    pushFx(state, { target: 'enemy', enemyIdx: idx, kind: 'seal', value: '印' });
  }
}

/**
 * 玩家选【斩】→ 直接杀。
 * 玩家选【封】→ 进入拼符 mini-game，挑战成功后才算封印。
 */
export function chooseSeal(state: BattleState, enemyIdx: number, choice: 'kill' | 'seal'): void {
  if (state.phase !== 'sealChoice') return;
  const enemy = state.enemies[enemyIdx];
  if (!enemy) return;
  if (choice === 'kill') {
    enemy.hp = 0;
    log(state, `你选择【斩】了 ${enemy.name}。`);
    if (allEnemiesDefeated(state)) {
      state.phase = 'won';
      finalizeOutcome(state);
    } else {
      state.phase = 'playerAction';
    }
    return;
  }
  // 【封】→ 进入拼符挑战
  state.phase = 'sealMiniGame';
  state.sealChallenge = {
    enemyIdx,
    sequence: enemy.sealPattern ?? generateSealPattern(enemy.rank),
    progress: 0,
    failed: false,
  };
  log(state, `镇妖印现，拼符以封！`);
}

/**
 * 拼符挑战：玩家点了一个笔画。
 * 对 → progress++，序列完成后封印成功；错 → 失败，扣血，返回 playerAction
 */
export function submitStroke(state: BattleState, stroke: StrokeKind): void {
  if (state.phase !== 'sealMiniGame' || !state.sealChallenge) return;
  const ch = state.sealChallenge;
  const expected = ch.sequence[ch.progress];
  if (stroke === expected) {
    ch.progress += 1;
    if (ch.progress >= ch.sequence.length) {
      // 成功
      const enemy = state.enemies[ch.enemyIdx];
      if (enemy) {
        enemy.hp = 0;
        enemy.sealed = true;
        enemy.sealedPerfect = !ch.failed;
        log(state, `封印成功！${enemy.name} 化作一卷符。`);
      }
      state.sealChallenge = null;
      if (allEnemiesDefeated(state)) {
        state.phase = 'won';
        finalizeOutcome(state);
      } else {
        state.phase = 'playerAction';
      }
    }
  } else {
    // 失败
    ch.failed = true;
    state.playerHp = Math.max(0, state.playerHp - balance.seal.failPenaltyHp);
    pushFx(state, { target: 'player', kind: 'damage', value: balance.seal.failPenaltyHp });
    log(state, `笔画错乱，封印失败！你损 ${balance.seal.failPenaltyHp} 气血。妖逃回。`);
    // 敌人恢复一半 HP 并脱离封印阈值
    const enemy = state.enemies[ch.enemyIdx];
    if (enemy) {
      enemy.hp = Math.round(enemy.maxHp * 0.5);
      enemy.sealChoiceTriggered = false; // 允许再次触发
    }
    state.sealChallenge = null;
    if (state.playerHp <= 0) {
      state.phase = 'lost';
      finalizeOutcome(state);
    } else {
      state.phase = 'playerAction';
    }
  }
}

export function cancelSealChoice(state: BattleState): void {
  if (state.phase !== 'sealChoice') return;
  // 恢复 sealChoiceTriggered 反正它在敌 HP 这回合还会再触发一次？
  // 设计上：一旦触发，就必须做选择；这里给个"晚点决定"回退到 playerAction。
  state.phase = 'playerAction';
}

// ============================================================================
// 结束回合 / 敌方回合
// ============================================================================
export function endTurn(state: BattleState, rng: RNG): void {
  if (state.phase !== 'playerAction') return;
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
  for (let i = 0; i < state.enemies.length; i++) {
    const e = state.enemies[i];
    if (e.hp <= 0) continue;
    e.block = 0;
    if (e.status.poison > 0) {
      const dmg = e.status.poison;
      e.hp = Math.max(0, e.hp - dmg);
      pushFx(state, { target: 'enemy', enemyIdx: i, kind: 'poison', value: dmg });
      log(state, `${e.name} 中毒 ${dmg}。`);
      e.status.poison = Math.max(0, e.status.poison - 1);
    }
    decayEnemyStatus(e);
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
      pushFx(state, {
        target: 'enemy',
        enemyIdx: state.enemies.indexOf(e),
        kind: 'block',
        value: intent.block ?? 0,
      });
      return;
    }
    case 'charge':
      return;
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
          ((e.rewardCurrency[0] + e.rewardCurrency[1]) / 2) * balance.seal.currencyRatio,
        );
        // 妖卡初始妖性（按 rank）
        const initYaoxing = balance.seal.initialYaoxing[e.rank];
        const sealedCard: Card = {
          ...e.sealedCard,
          id: `yao_${e.yaoId}_${Date.now()}_${outcome.sealedCards.length}`,
          yaoxing: initYaoxing,
        };
        // 完美封印 · 降初始妖性 + 伤害效果 +2
        if (e.sealedPerfect) {
          sealedCard.yaoxing = Math.max(0, initYaoxing - 10);
          sealedCard.name = `${sealedCard.name}·完`;
          sealedCard.effects = (sealedCard.effects ?? []).map((ef) =>
            ef.kind === 'damage' ? { ...ef, amount: ef.amount + 2 } : ef,
          );
        }
        outcome.sealedCards.push(sealedCard);
      } else {
        anyKilled = true;
        const [lo, hi] = e.rewardCurrency;
        outcome.currencyGained += Math.floor((lo + hi) / 2);
      }
    }
    outcome.resolution = anySealed && anyKilled ? 'mixed' : anySealed ? 'seal' : 'kill';
    outcome.shouldOfferReward = anyKilled;
  }
  state.outcome = outcome;
}

// ============================================================================
// 意图公示
// ============================================================================
export function intentOf(e: EnemyState): Intent | null {
  if (e.hp <= 0) return null;
  if (e.chargeInterrupted) return null;
  if (e.status.intentSealed > 0) {
    return { kind: 'cast', label: '· 空 过 ·' };
  }
  return currentIntent(e);
}

export type { BattlePhase };
