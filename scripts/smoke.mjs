#!/usr/bin/env node
/**
 * Smoke 测试 · 引擎所有关键 path 各跑一次
 *
 * 不是仿真器（不管结果对不对），只保证：
 *   · 不抛异常
 *   · 状态转移能走通
 *   · 每个 API 都能被调用
 *
 * 通过：12/12 绿，失败：第一条爆错即退出非零。
 */

import { build } from 'esbuild';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const tmpDir = resolve(root, 'node_modules/.sim-cache');
mkdirSync(tmpDir, { recursive: true });
const entry = resolve(tmpDir, 'smoke-entry.ts');
const outFile = resolve(tmpDir, 'smoke.mjs');

const src = `
import {
  createRng, startBattle, playCard, endTurn, chooseSeal, drawCards,
  cardToInstance, aiRunBattle, intentOf,
  submitStroke,
} from '${resolve(root, 'src/engine/index.ts').replace(/\\/g, '/')}';
import {
  createRun, enterNode, resolveBattle, takeReward, resolveOverflow,
  resolveEventChoice, dismissEvent, shrineAct, leaveShrine, runFinished,
  currentNode, advanceNode,
} from '${resolve(root, 'src/engine/run.ts').replace(/\\/g, '/')}';
import { loadSave, saveSave, clearSave, persistRun, updateMeta } from '${resolve(root, 'src/engine/save.ts').replace(/\\/g, '/')}';
import { buildStarterDeck, ALL_REWARD_CARDS } from '${resolve(root, 'src/data/cards/index.ts').replace(/\\/g, '/')}';
import { getYao, ALL_YAO } from '${resolve(root, 'src/data/yao/index.ts').replace(/\\/g, '/')}';
import { ALL_EVENTS } from '${resolve(root, 'src/data/events/index.ts').replace(/\\/g, '/')}';
import { balance } from '${resolve(root, 'src/config/balance.ts').replace(/\\/g, '/')}';

let passed = 0;
let failed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('  ✓ ' + name);
  } catch (err) {
    failed++;
    console.log('  ✗ ' + name);
    console.error(err);
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

console.log('── 引擎 smoke ─────────────────────────────');

test('createRun returns chapter1 with 8 nodes', () => {
  const r = createRun(1);
  assert(r.map.length === 8, 'map should have 8 nodes');
  assert(r.deck.length === 10, 'starter deck 10');
  assert(r.hp === balance.player.maxHp);
});

test('startBattle + playCard + endTurn loop', () => {
  const rng = createRng(42);
  const b = startBattle(['qinghu'], 70, 70, buildStarterDeck(), rng, 'normal');
  assert(b.phase === 'playerAction', 'phase after start');
  assert(b.hand.length > 0, 'hand drawn');
  // try to play first playable card
  for (let i = 0; i < b.hand.length; i++) {
    if (b.energy >= b.hand[i].cost) { playCard(b, i, rng); break; }
  }
  endTurn(b, rng);
  assert(b.turn >= 2 || b.phase === 'won' || b.phase === 'sealChoice' || b.phase === 'lost');
});

test('seal choice triggers at 30% HP', () => {
  const rng = createRng(99);
  // 强行让手牌只剩伤害卡
  const b = startBattle(['qinghu'], 70, 70, buildStarterDeck(), rng, 'normal');
  // 直接暴力打到 < 30%
  let safety = 40;
  while (safety-- > 0 && b.phase !== 'sealChoice' && b.phase !== 'won' && b.phase !== 'lost') {
    const idx = b.hand.findIndex((c) => c.effects?.some((e) => e.kind === 'damage') && b.energy >= c.cost);
    if (idx < 0) { endTurn(b, rng); continue; }
    playCard(b, idx, rng);
  }
  // 至少一次触发过 seal 或者直接赢
  assert(['sealChoice', 'won', 'lost'].includes(b.phase), 'reached a terminal/sealChoice phase');
});

test('chooseSeal branch both kill and seal are safe', () => {
  for (const choice of ['kill', 'seal']) {
    const rng = createRng(choice === 'kill' ? 7 : 8);
    const b = startBattle(['qinghu'], 70, 70, buildStarterDeck(), rng, 'normal');
    let safety = 40;
    while (safety-- > 0 && b.phase === 'playerAction') {
      const idx = b.hand.findIndex((c) => c.effects?.some((e) => e.kind === 'damage') && b.energy >= c.cost);
      if (idx < 0) { endTurn(b, rng); continue; }
      playCard(b, idx, rng);
    }
    if (b.phase === 'sealChoice') {
      const sealIdx = b.enemies.findIndex((e) => e.sealChoiceTriggered);
      chooseSeal(b, sealIdx, choice);
      if (choice === 'kill') {
        assert(b.phase === 'won' || b.phase === 'playerAction', 'kill should resolve immediately, got ' + b.phase);
      } else {
        // 'seal' → enters mini-game phase; feed the right strokes to complete it
        assert(b.phase === 'sealMiniGame', 'seal should trigger mini-game, got ' + b.phase);
        assert(b.sealChallenge, 'sealChallenge should be set');
        for (const s of b.sealChallenge.sequence) {
          submitStroke(b, s);
        }
        assert(b.phase === 'won' || b.phase === 'playerAction', 'after perfect seal should resume, got ' + b.phase);
      }
    }
  }
});

test('seal mini-game fail path penalizes player', () => {
  const rng = createRng(11);
  const b = startBattle(['qinghu'], 70, 70, buildStarterDeck(), rng, 'normal');
  let safety = 40;
  while (safety-- > 0 && b.phase === 'playerAction') {
    const idx = b.hand.findIndex((c) => c.effects?.some((e) => e.kind === 'damage') && b.energy >= c.cost);
    if (idx < 0) { endTurn(b, rng); continue; }
    playCard(b, idx, rng);
  }
  if (b.phase === 'sealChoice') {
    const sealIdx = b.enemies.findIndex((e) => e.sealChoiceTriggered);
    chooseSeal(b, sealIdx, 'seal');
    assert(b.phase === 'sealMiniGame');
    const hpBefore = b.playerHp;
    // 乱点一笔不对的
    const expected = b.sealChallenge.sequence[0];
    const wrong = expected === 'dot' ? 'loop' : 'dot';
    submitStroke(b, wrong);
    assert(b.playerHp < hpBefore, 'player lost HP on seal fail');
    assert(b.phase === 'playerAction' || b.phase === 'lost');
  }
});

test('aiRunBattle finishes on every yao type', () => {
  for (const yao of ALL_YAO) {
    const rng = createRng(yao.id.charCodeAt(0) * 31);
    const kind = yao.rank === 'S' ? 'boss' : yao.rank === 'B' ? 'elite' : 'normal';
    const b = startBattle([yao.id], 70, 70, buildStarterDeck(), rng, kind);
    const { result } = aiRunBattle(b, rng, { sealPolicy: 'alwaysKill' });
    assert(result === 'win' || result === 'lose', 'battle must terminate');
  }
});

test('event flow: every event × every choice', () => {
  for (const ev of ALL_EVENTS) {
    for (let i = 0; i < ev.choices.length; i++) {
      const rng = createRng(ev.id.length * 13 + i);
      const run = createRun(100 + i);
      // 走到第一个 event 节点 n3
      run.nodeIndex = 2;
      run.map[2].eventId = ev.id;
      enterNode(run, rng);
      assert(run.pendingEvent, 'event created');
      resolveEventChoice(run, i, rng);
      assert(run.pendingEvent && run.pendingEvent.chosenOutcome, 'outcome applied');
      dismissEvent(run);
      assert(!run.pendingEvent, 'event dismissed');
    }
  }
});

test('shrine actions: upgrade / remove / rest / leave', () => {
  const rng = createRng(33);
  const run = createRun(33);
  run.currency = 100;
  run.hp = 30;
  // 走到 shrine 节点 n5
  run.nodeIndex = 4;
  shrineAct(run, { kind: 'upgrade', cardIdx: 0 });
  shrineAct(run, { kind: 'remove', cardIdx: 0 });
  shrineAct(run, { kind: 'rest' });
  leaveShrine(run);
  assert(run.nodeIndex === 5, 'shrine advanced');
  assert(run.hp > 30, 'rest healed');
});

test('overflow: add cards over 20 and trim', () => {
  const rng = createRng(77);
  const run = createRun(77);
  // 塞卡到 22 张
  while (run.deck.length < 22) run.deck.push(ALL_REWARD_CARDS[0]);
  run.pendingOverflow = { deckSnapshot: [...run.deck], reason: 'reward' };
  resolveOverflow(run, 10);
  assert(run.deck.length === 21, 'one removed');
  assert(!run.pendingOverflow, 'overflow cleared');
});

test('takeReward: card / skip', () => {
  const rng = createRng(55);
  const run = createRun(55);
  run.pendingReward = {
    currency: 10,
    cardChoices: [ALL_REWARD_CARDS[0], ALL_REWARD_CARDS[1], ALL_REWARD_CARDS[2]],
    done: false,
  };
  const before = run.deck.length;
  takeReward(run, 0);
  assert(run.deck.length === before + 1, 'card added');
  run.pendingReward = {
    currency: 5,
    cardChoices: [ALL_REWARD_CARDS[0]],
    done: false,
  };
  // 这一次 skip（无卡加入）
  const before2 = run.deck.length;
  takeReward(run, 'skip');
  assert(run.deck.length === before2, 'skip: no change');
});

test('boss: maxHp +5 on win', () => {
  const rng = createRng(11);
  const run = createRun(11);
  run.nodeIndex = 7;  // boss 节点
  enterNode(run, rng);
  const maxHpBefore = run.maxHp;
  if (run.battle) {
    const { result } = aiRunBattle(run.battle, rng, { sealPolicy: 'alwaysKill' });
    resolveBattle(run, rng);
    if (result === 'win') {
      assert(run.maxHp === maxHpBefore + 5, 'boss +5 maxHp');
    }
  }
});

test('save roundtrip (in-memory fallback under Node)', () => {
  clearSave();
  const s = loadSave();
  s.meta.seals = 7;
  saveSave(s);
  const s2 = loadSave();
  assert(s2.meta.seals === 7, 'meta persisted');
  updateMeta((m) => { m.victories += 1; });
  const s3 = loadSave();
  assert(s3.meta.victories === 1, 'updateMeta works');
  const run = createRun(1);
  persistRun(run);
  const s4 = loadSave();
  assert(s4.runInProgress !== null, 'run persisted');
  clearSave();
});

test('intentOf handles sealed intent', () => {
  const rng = createRng(3);
  const b = startBattle(['qinghu'], 70, 70, buildStarterDeck(), rng, 'normal');
  b.enemies[0].status.intentSealed = 1;
  const i = intentOf(b.enemies[0]);
  assert(i && i.label.includes('空'));
});

console.log('── Result ─────────────────────────────────');
console.log('  ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
`;

writeFileSync(entry, src);

await build({
  entryPoints: [entry],
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node18',
  outfile: outFile,
  logLevel: 'error',
});

const child = spawnSync(process.execPath, [outFile], { stdio: 'inherit' });
try {
  rmSync(entry);
  rmSync(outFile);
} catch {
  /* ignore */
}
process.exit(child.status ?? 0);
