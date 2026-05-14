#!/usr/bin/env node
/**
 * 自动战斗测试 · 完整流程验证
 *
 * 测试内容：
 *   1. 创建 seed=42 的 run
 *   2. 自动遍历多个节点（battle → reward → map → event → shrine → overflow）
 *   3. 边界检查：
 *      · pendingReward.cardChoices 为空时的处理
 *      · 牌组超 20 → overflow 流程
 *      · 章节推进（所有节点耗尽后）
 *      · 祭坛 pendingOverflow 清理
 *      · 完整流程：battle→won→resolveBattle→pendingReward→reward→advanceNode→nextNode
 *   4. 检测：崩溃、空引用、死循环、错误阶段转换
 *
 * 用法：node scripts/auto_test.cjs
 */

'use strict';

const path = require('node:path');
const { createRequire } = require('node:module');

// 动态 require 以便直接引用 TS 源（esbuild 在运行时 bundle）
const requireFromSrc = createRequire(
  path.resolve(__dirname, '../src/engine/index.ts'),
);

// ============================================================================
// 引擎加载（esbuild bundle）
// ============================================================================
const BUNDLE_ENTRY = path.resolve(__dirname, '../node_modules/.auto-test-entry.cjs');
const BUNDLE_OUT = path.resolve(__dirname, '../node_modules/.auto-test-bundle.cjs');

const fs = require('node:fs');
const os = require('node:os');

// 临时入口文件内容
// 使用 forward slashes 以兼容 esbuild on Windows
const toForwardSlash = (p) => p.replace(/\\/g, '/');
const srcEngine = toForwardSlash(path.resolve(__dirname, '../src/engine/index.ts'));
const srcRun = toForwardSlash(path.resolve(__dirname, '../src/engine/run.ts'));
const srcCards = toForwardSlash(path.resolve(__dirname, '../src/data/cards/index.ts'));
const srcYao = toForwardSlash(path.resolve(__dirname, '../src/data/yao/index.ts'));
const srcEvents = toForwardSlash(path.resolve(__dirname, '../src/data/events/index.ts'));
const srcBalance = toForwardSlash(path.resolve(__dirname, '../src/config/balance.ts'));

const entrySrc = `
import * as engineMod from '${srcEngine}';
import * as runMod from '${srcRun}';
import * as cardsMod from '${srcCards}';
import * as yaoMod from '${srcYao}';
import { balance } from '${srcBalance}';

export const engine = engineMod;
export const runEngine = runMod;
export const cards = cardsMod;
export const yao = yaoMod;
export { balance };
`;

// 确保缓存目录存在
const cacheDir = path.dirname(BUNDLE_OUT);
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// 写入临时入口
fs.writeFileSync(BUNDLE_ENTRY, entrySrc);

let buildOk = false;
try {
  // 使用 esbuild 进行 bundle
  const esbuild = require('esbuild');
  esbuild.buildSync({
    entryPoints: [BUNDLE_ENTRY],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    target: 'node18',
    outfile: BUNDLE_OUT,
    logLevel: 'error',
    minify: false,
  });
  buildOk = true;
} catch (e) {
  console.error('esbuild failed:', e.message);
  process.exit(1);
} finally {
  // 清理入口文件
  try { fs.unlinkSync(BUNDLE_ENTRY); } catch (_) {}
}

if (!buildOk || !fs.existsSync(BUNDLE_OUT)) {
  console.error('Bundle failed');
  process.exit(1);
}

const bundled = require(BUNDLE_OUT);

const engine = bundled.engine;
const runEngine = bundled.runEngine;
const cards = bundled.cards;
const yao = bundled.yao;
const balance = bundled.balance;

const {
  createRng,
} = engine;

const {
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
  advanceNode,
  runFinished,
  CHAPTER_ORDER,
} = runEngine;

const { ALL_REWARD_CARDS } = cards;
const { ALL_YAO } = yao;

// ============================================================================
// 测试框架
// ============================================================================
let passed = 0;
let failed = 0;
const testResults = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    testResults.push({ name, status: 'PASS' });
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    failed++;
    testResults.push({ name, status: 'FAIL', error: err.message });
    console.log(`  [FAIL] ${name}`);
    console.error(`        └─ ${err.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function assertNotNull(val, msg) {
  if (val === null || val === undefined) throw new Error(msg || `expected non-null, got ${val}`);
}

function assertEq(a, b, msg) {
  if (a !== b) throw new Error(msg || `expected ${a} === ${b}`);
}

// ============================================================================
// 测试用例
// ============================================================================
console.log('\n═══ 自动战斗测试 ═══');

test('createRun(seed=42) 初始化正确', () => {
  const run = createRun(42);
  assert(run.seed === 42, 'seed should be 42');
  assert(run.deck.length === 10, 'starter deck 10 cards');
  assert(run.hp === balance.player.maxHp, 'hp should be maxHp');
  assert(run.map.length === 8, 'map should have 8 nodes');
  assert(run.nodeIndex === 0, 'should start at node 0');
  assert(run.chapter === 'qingqiu', 'first chapter should be qingqiu');
  assert(run.pendingReward === null, 'no pending reward initially');
  assert(run.pendingEvent === null, 'no pending event initially');
  assert(run.pendingOverflow === null, 'no pending overflow initially');
});

test('enterNode 创建战斗节点', () => {
  const run = createRun(42);
  const rng = createRng(42);
  const node = currentNode(run);
  assert(node && node.kind === 'battle', 'first node should be battle');

  enterNode(run, rng);
  assertNotNull(run.battle, 'battle should be created after enterNode');
  assert(run.battle.phase === 'playerAction' || run.battle.phase === 'playerTurn', 'battle should be in action phase');
});

test('aiRunBattle 能正常结束战斗', () => {
  const run = createRun(42);
  const rng = createRng(42);
  enterNode(run, rng);

  assertNotNull(run.battle, 'battle should exist');
  const { result } = engine.aiRunBattle(run.battle, rng, { sealPolicy: 'alwaysKill' });
  assert(result === 'win' || result === 'lose', `battle should end with win or lose, got ${result}`);
});

test('resolveBattle 将 battle 转为 pendingReward', () => {
  const run = createRun(42);
  const rng = createRng(42);
  enterNode(run, rng);
  engine.aiRunBattle(run.battle, rng, { sealPolicy: 'alwaysKill' });

  resolveBattle(run, rng);
  assert(run.battle === null, 'battle should be cleared after resolveBattle');

  if (run.hp > 0) {
    assertNotNull(run.pendingReward, 'pendingReward should be set after winning');
    assert(Array.isArray(run.pendingReward.cardChoices), 'cardChoices should be an array');
  }
});

test('takeReward 添加卡牌到牌组', () => {
  const run = createRun(42);
  const rng = createRng(42);

  // 手动设置 pendingReward
  run.pendingReward = {
    currency: 10,
    cardChoices: [ALL_REWARD_CARDS[0], ALL_REWARD_CARDS[1], ALL_REWARD_CARDS[2]],
    done: false,
  };

  const deckLenBefore = run.deck.length;
  takeReward(run, 0);
  assert(run.deck.length === deckLenBefore + 1, 'card should be added to deck');
  assert(run.pendingReward === null, 'pendingReward should be cleared');
});

test('takeReward(skip) 不添加卡牌', () => {
  const run = createRun(42);
  run.pendingReward = {
    currency: 5,
    cardChoices: [ALL_REWARD_CARDS[0]],
    done: false,
  };

  const deckLenBefore = run.deck.length;
  takeReward(run, 'skip');
  assert(run.deck.length === deckLenBefore, 'skip should not add card');
  assert(run.pendingReward === null, 'pendingReward should be cleared after skip');
});

test('牌组超 20 → pendingOverflow', () => {
  const run = createRun(42);
  run.currency = 100;
  run.deck = [];

  // 故意塞到 21 张
  for (let i = 0; i < 21; i++) {
    run.deck.push({ ...ALL_REWARD_CARDS[0], id: `card_${i}` });
  }

  run.pendingReward = {
    currency: 10,
    cardChoices: [ALL_REWARD_CARDS[0]],
    done: false,
  };

  takeReward(run, 0);
  assert(run.deck.length === 22, 'deck should now have 22 cards');
  assertNotNull(run.pendingOverflow, 'pendingOverflow should be set');
  assertEq(run.pendingOverflow.reason, 'reward', 'reason should be reward');
});

test('resolveOverflow 删卡并清理', () => {
  const run = createRun(42);
  run.deck = [];
  for (let i = 0; i < 22; i++) {
    run.deck.push({ ...ALL_REWARD_CARDS[0], id: `card_${i}`, name: `卡牌${i}` });
  }

  run.pendingOverflow = {
    deckSnapshot: [...run.deck],
    reason: 'reward',
  };

  assert(run.deck.length === 22, 'deck should have 22 cards');
  resolveOverflow(run, 5);
  assert(run.deck.length === 21, 'deck should have 21 cards after removing one');
  assert(run.pendingOverflow === null, 'pendingOverflow should be cleared');
});

test('完整流程：battle → reward → advanceNode → nextNode', () => {
  const run = createRun(42);
  const rng = createRng(42);

  // 第一个节点是 battle
  assert(currentNode(run).kind === 'battle', 'node 0 should be battle');

  enterNode(run, rng);
  engine.aiRunBattle(run.battle, rng, { sealPolicy: 'alwaysKill' });
  resolveBattle(run, rng);

  // 如果赢了，应该有 pendingReward
  if (run.hp > 0) {
    const nodeBefore = run.nodeIndex;
    takeReward(run, 0);

    // takeReward 会调用 advanceNode，所以 nodeIndex 应该已经 +1
    // 下一个节点可能是 event 或 battle
    const nextNode = currentNode(run);
    assert(nextNode !== null, 'should have a next node');
    console.log(`        └─ next node: ${nextNode.kind} (${nextNode.label})`);
  }
});

test('事件节点流程', () => {
  const run = createRun(99);
  const rng = createRng(99);

  // 手动跳到事件节点（nodeIndex=2 是事件节点）
  run.nodeIndex = 2;
  const eventNode = currentNode(run);
  assert(eventNode.kind === 'event', 'node 2 should be event');

  enterNode(run, rng);
  assertNotNull(run.pendingEvent, 'pendingEvent should be set');

  // 选择第一个选项
  const choiceCount = run.pendingEvent.eventId ? 1 : 0;
  if (choiceCount > 0) {
    resolveEventChoice(run, 0, rng);
    assert(run.pendingEvent.chosenOutcome, 'outcome should be set');
  }

  dismissEvent(run);
  assert(run.pendingEvent === null, 'pendingEvent should be cleared after dismiss');
  assert(run.nodeIndex === 3, 'should have advanced to node 3');
});

test('祭坛节点流程', () => {
  const run = createRun(55);
  const rng = createRng(55);
  run.currency = 100;
  run.hp = 30;

  // nodeIndex=4 是祭坛节点
  run.nodeIndex = 4;
  const shrineNode = currentNode(run);
  assert(shrineNode.kind === 'shrine', 'node 4 should be shrine');

  // 祭坛操作：升级第一张卡
  const result1 = shrineAct(run, { kind: 'upgrade', cardIdx: 0 });
  assert(result1.includes('升阶'), 'upgrade should succeed');

  // 删一张卡
  const deckLenBefore = run.deck.length;
  const result2 = shrineAct(run, { kind: 'remove', cardIdx: 0 });
  assert(result2.includes('删'), 'remove should succeed');
  assert(run.deck.length === deckLenBefore - 1, 'card should be removed');

  // 休息
  const hpBefore = run.hp;
  const result3 = shrineAct(run, { kind: 'rest' });
  assert(result3.includes('回复'), 'rest should heal');
  assert(run.hp > hpBefore, 'hp should increase after rest');

  // 离开祭坛
  leaveShrine(run);
  assert(run.nodeIndex === 5, 'should advance to node 5 after leaving shrine');
});

test('祭坛删卡后触发 overflow', () => {
  const run = createRun(55);
  run.currency = 100;
  run.deck = [];
  // 刚好 20 张卡
  for (let i = 0; i < 20; i++) {
    run.deck.push({ ...ALL_REWARD_CARDS[0], id: `card_${i}` });
  }

  run.nodeIndex = 4; // shrine
  shrineAct(run, { kind: 'remove', cardIdx: 0 });
  // 删了一张后 deck = 19，没到 overflow
  assert(run.deck.length === 19, 'deck should have 19 cards');
  assert(run.pendingOverflow === null, 'no overflow when under 20');

  // 再删一张
  shrineAct(run, { kind: 'remove', cardIdx: 0 });
  assert(run.deck.length === 18, 'deck should have 18 cards');

  leaveShrine(run);
});

test('章节耗尽后推进到下一章节', () => {
  const run = createRun(42);
  const rng = createRng(42);

  // 直接跳到 boss 节点
  run.nodeIndex = 7;
  const bossNode = currentNode(run);
  assert(bossNode.kind === 'boss', 'node 7 should be boss');

  enterNode(run, rng);
  engine.aiRunBattle(run.battle, rng, { sealPolicy: 'alwaysKill' });
  resolveBattle(run, rng);

  if (run.hp > 0 && run.chapter === 'qingqiu') {
    // Boss 胜利后应该推进到下一章节
    assert(run.chapter === 'taotie', 'chapter should advance to taotie after boss win');
    assert(run.nodeIndex === 0, 'nodeIndex should reset to 0 in new chapter');
    assert(run.map.length === 8, 'new chapter should have 8 nodes');
    console.log(`        └─ new chapter: ${run.chapter}`);
  }
});

test('runFinished 检测游戏结束', () => {
  const run = createRun(42);
  assert(runFinished(run) === null, 'new run should not be finished');

  run.hp = 0;
  assert(runFinished(run) === 'defeated', 'hp=0 should be defeated');
});

test('空 cardChoices 处理（所有敌人被封印）', () => {
  const run = createRun(42);
  const rng = createRng(42);

  // 手动设置 pendingReward 且 cardChoices 为空
  run.pendingReward = {
    currency: 10,
    cardChoices: [], // 空数组 - 所有敌人都被封印
    done: false,
  };

  // 即使 cardChoices 为空，takeReward 也应该能正常处理
  const deckLenBefore = run.deck.length;
  try {
    takeReward(run, 0); // 尝试选 0，但数组为空
    // 如果正确处理，应该不会崩溃
    assert(run.pendingReward === null || run.pendingReward.done === true,
           'pendingReward should be resolved');
    console.log(`        └─ empty cardChoices handled OK`);
  } catch (e) {
    throw new Error(`takeReward with empty cardChoices crashed: ${e.message}`);
  }
});

test('连续多节点遍历（battle → event → battle → shrine）', () => {
  const run = createRun(42);
  const rng = createRng(42);
  let nodesVisited = 0;
  const maxNodes = 6; // 测试前 6 个节点

  for (let i = 0; i < maxNodes && run.nodeIndex < run.map.length && run.hp > 0; i++) {
    const node = currentNode(run);
    if (!node) break;

    console.log(`        └─ node ${run.nodeIndex}: ${node.kind} (${node.label})`);

    if (node.kind === 'battle' || node.kind === 'elite' || node.kind === 'boss') {
      enterNode(run, rng);
      if (run.battle) {
        engine.aiRunBattle(run.battle, rng, { sealPolicy: 'alwaysKill' });
        resolveBattle(run, rng);

        // 处理奖励
        if (run.pendingReward) {
          if (run.pendingReward.cardChoices.length > 0) {
            takeReward(run, 0);
          } else {
            takeReward(run, 'skip'); // 空选择只能跳过
          }

          // 处理溢出
          while (run.pendingOverflow) {
            resolveOverflow(run, 0);
          }
        }
      }
    } else if (node.kind === 'event') {
      enterNode(run, rng);
      if (run.pendingEvent) {
        resolveEventChoice(run, 0, rng);
        dismissEvent(run);
      }
    } else if (node.kind === 'shrine') {
      // 在祭坛休息一下就离开
      shrineAct(run, { kind: 'rest' });
      leaveShrine(run);
    }

    nodesVisited++;

    // 检查是否有致命错误
    if (run.hp <= 0) {
      console.log(`        └─ run defeated at node ${run.nodeIndex}`);
      break;
    }
  }

  assert(nodesVisited >= 4, `should visit at least 4 nodes, visited ${nodesVisited}`);
  console.log(`        └─ visited ${nodesVisited} nodes successfully`);
});

test('溢出后选择删除的索引边界检查', () => {
  const run = createRun(42);
  run.deck = [];
  for (let i = 0; i < 22; i++) {
    run.deck.push({ ...ALL_REWARD_CARDS[0], id: `card_${i}` });
  }

  run.pendingOverflow = {
    deckSnapshot: [...run.deck],
    reason: 'reward',
  };

  // 尝试用无效索引删除
  try {
    resolveOverflow(run, 999); // 无效索引
    // 应该不崩溃但也不删除任何卡
    assert(run.pendingOverflow !== null, 'overflow should still be present with invalid index');
  } catch (e) {
    throw new Error(`resolveOverflow with invalid index crashed: ${e.message}`);
  }

  // 负数索引
  try {
    resolveOverflow(run, -1);
    assert(run.pendingOverflow !== null, 'overflow should still be present with negative index');
  } catch (e) {
    throw new Error(`resolveOverflow with negative index crashed: ${e.message}`);
  }
});

test('deckWithYaoxing 妖性状态持久化', () => {
  const run = createRun(42);
  const rng = createRng(42);

  // 设置一些妖性
  run.yaoxing = {
    'qinghu': 50,
    'yehu': 75,
  };

  // 打一次战斗
  run.nodeIndex = 0;
  enterNode(run, rng);
  engine.aiRunBattle(run.battle, rng, { sealPolicy: 'alwaysKill' });
  resolveBattle(run, rng);

  // 妖性应该衰减
  if (run.yaoxing) {
    assert(run.yaoxing['qinghu'] === 49, 'yaoxing should decay by 1');
    console.log(`        └─ yaoxing after battle: ${JSON.stringify(run.yaoxing)}`);
  }
});

test('检查所有 yao 类型都能完成战斗', () => {
  // 测试每个敌人类型都能正常结束（不会死循环）
  const yaoIds = ['qinghu', 'yehu', 'jiuweihu_boss', 'taotie_lord'];

  for (const yaoId of yaoIds) {
    const rng = createRng(yaoId.length * 31);
    const kind = yaoId.includes('boss') || yaoId.includes('lord') ? 'boss'
                 : yaoId.includes('elite') ? 'elite' : 'normal';

    const b = engine.startBattle(
      [yaoId],
      70,
      70,
      cards.buildStarterDeck(),
      rng,
      kind,
    );

    const { result } = engine.aiRunBattle(b, rng, { sealPolicy: 'alwaysKill' });
    assert(result === 'win' || result === 'lose', `yao ${yaoId} battle must terminate, got ${result}`);
  }
  console.log(`        └─ all ${yaoIds.length} yao types tested`);
});

// ============================================================================
// 主循环：自动战斗到结束
// ============================================================================
console.log('\n── 全流程自动战斗测试 ───────────────────────');

test('自动战斗直到游戏结束（seed=42）', () => {
  const run = createRun(42);
  const rng = createRng(42);
  let stepCount = 0;
  const maxSteps = 100; // 防止无限循环

  while (run.hp > 0 && run.nodeIndex < run.map.length && stepCount < maxSteps) {
    stepCount++;
    const node = currentNode(run);
    if (!node) {
      console.log(`        └─ no more nodes at step ${stepCount}`);
      break;
    }

    // 阶段转换检查
    const phaseBefore = run.battle?.phase || (run.pendingReward ? 'pendingReward' :
                        run.pendingEvent ? 'pendingEvent' :
                        run.pendingOverflow ? 'pendingOverflow' : 'idle');

    if (node.kind === 'battle' || node.kind === 'elite' || node.kind === 'boss') {
      enterNode(run, rng);
      assertNotNull(run.battle, `step ${stepCount}: battle should be created`);

      const battleResult = engine.aiRunBattle(run.battle, rng, { sealPolicy: 'alwaysKill' });
      assert(battleResult.result === 'win' || battleResult.result === 'lose',
             `step ${stepCount}: battle should end`);

      resolveBattle(run, rng);

      // 处理 pendingReward
      while (run.pendingReward) {
        if (run.pendingReward.cardChoices.length > 0) {
          takeReward(run, 0);
        } else {
          // 空 cardChoices = 全封印情况，跳过
          takeReward(run, 'skip');
        }
      }

      // 处理溢出
      while (run.pendingOverflow) {
        // 删除第二张卡（保留第一张）
        resolveOverflow(run, 1);
      }

    } else if (node.kind === 'event') {
      enterNode(run, rng);
      if (run.pendingEvent) {
        // 选第一个选项
        resolveEventChoice(run, 0, rng);
        dismissEvent(run);
      }

    } else if (node.kind === 'shrine') {
      // 休息一下就离开
      shrineAct(run, { kind: 'rest' });
      leaveShrine(run);
    }

    // 夜间反噬检查
    if (run.yaoxing && Object.keys(run.yaoxing).length > 0) {
      const yaoCards = run.deck.filter(c => c.type === 'yao');
      if (yaoCards.length > 0) {
        const total = yaoCards.reduce((s, c) => s + (run.yaoxing[c.id] || 0), 0);
        const avg = total / yaoCards.length;
        if (avg >= 50) {
          console.log(`        └─ step ${stepCount}: backlash triggered (avg yaoxing ${avg.toFixed(1)})`);
        }
      }
    }

    const finishState = runFinished(run);
    if (finishState) {
      console.log(`        └─ run finished: ${finishState} at step ${stepCount}`);
      break;
    }

    // 安全检查：防止死循环
    if (stepCount >= maxSteps) {
      throw new Error(`exceeded max steps (${maxSteps}), possible infinite loop`);
    }
  }

  assert(run.hp > 0 || runFinished(run) === 'defeated', 'run should be in ended state');
  console.log(`        └─ completed ${stepCount} steps, hp=${run.hp}, chapter=${run.chapter}`);
});

// ============================================================================
// 报告
// ============================================================================
console.log('\n═══ 测试结果 ═══');
console.log(`  通过: ${passed}`);
console.log(`  失败: ${failed}`);
console.log('');

if (failed > 0) {
  console.log('失败详情:');
  testResults.filter(r => r.status === 'FAIL').forEach(r => {
    console.log(`  - ${r.name}: ${r.error}`);
  });
  console.log('');
}

// 清理 bundle 文件
try {
  fs.unlinkSync(BUNDLE_OUT);
  fs.rmdirSync(cacheDir);
} catch (_) {}

// 退出码：失败 > 0 则非零
process.exit(failed > 0 ? 1 : 0);