/**
 * 战斗屏 · v0.2 核心 UI
 *
 * 布局：
 *   · 顶栏：玩家 HP/Block + 敌人 HP/意图（多敌横排）
 *   · 中区：敌人立绘 + 浮动数字
 *   · 底栏：能量 · 手牌 · 结束回合
 *   · SEAL_CHOICE 浮层
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '../../store/GameStore';
import { Button } from '../ui/Button';
import { HealthBar } from '../ui/HealthBar';
import { EnergyOrb } from '../ui/EnergyOrb';
import { FloatingNumber } from '../ui/FloatingNumber';
import { Card } from '../card/Card';
import { Portrait } from '../art/Portrait';
import { MistOverlay } from '../art/MistOverlay';
import { intentOf } from '../../engine';
import type { EnemyState } from '../../types';
import { DeckViewButton } from './partials/DeckView';

function StatusBadges({ enemy }: { enemy: EnemyState }) {
  const s = enemy.status;
  return (
    <div className="flex gap-1 flex-wrap justify-center mt-1">
      {s.poison > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 bg-jade/30 border border-jade/60 rounded-sm font-numeric text-jade">
          毒 {s.poison}
        </span>
      )}
      {s.weak > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 bg-mist/30 border border-mist rounded-sm font-numeric text-mist">
          虚 {s.weak}
        </span>
      )}
      {s.vulnerable > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 bg-vermillion/30 border border-vermillion/60 rounded-sm font-numeric text-vermillion-light">
          易 {s.vulnerable}
        </span>
      )}
      {s.intentSealed > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 bg-ember/30 border border-ember/60 rounded-sm font-numeric text-ember-glow">
          封印
        </span>
      )}
    </div>
  );
}

function PlayerStatusBadges() {
  const { run } = useGame();
  if (!run?.battle) return null;
  const s = run.battle.playerStatus;
  return (
    <div className="flex gap-1 flex-wrap">
      {s.poison > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 bg-jade/30 border border-jade/60 rounded-sm font-numeric text-jade">
          毒 {s.poison}
        </span>
      )}
      {s.weak > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 bg-mist/30 border border-mist rounded-sm font-numeric text-mist">
          虚 {s.weak}
        </span>
      )}
      {s.vulnerable > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 bg-vermillion/30 border border-vermillion/60 rounded-sm font-numeric text-vermillion-light">
          易 {s.vulnerable}
        </span>
      )}
    </div>
  );
}

export function BattleScreen() {
  const { run, playCard, endTurn, chooseSeal } = useGame();
  const [targetIdx, setTargetIdx] = useState(0);
  const [consumedFxIds, setConsumedFxIds] = useState<Set<string>>(new Set());
  const battleKey = useRef(0);

  const battle = run?.battle;

  // 当敌人全死或 target 无效 → 自动选第一个活的
  useEffect(() => {
    if (!battle) return;
    if (!battle.enemies[targetIdx] || battle.enemies[targetIdx].hp <= 0) {
      const alive = battle.enemies.findIndex((e) => e.hp > 0);
      if (alive >= 0) setTargetIdx(alive);
    }
  }, [battle, targetIdx]);

  // 战斗切换（不同敌人）时清一下已消费的 fx
  useEffect(() => {
    if (!battle) return;
    battleKey.current += 1;
    setConsumedFxIds(new Set());
  }, [battle?.enemies.map((e) => e.instanceId).join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  // fx 自动过期
  useEffect(() => {
    if (!battle || battle.fx.length === 0) return;
    const t = setTimeout(() => {
      setConsumedFxIds((prev) => {
        const next = new Set(prev);
        for (const f of battle.fx) next.add(f.id);
        return next;
      });
    }, 1400);
    return () => clearTimeout(t);
  }, [battle?.fx.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeFx = useMemo(
    () => (battle ? battle.fx.filter((f) => !consumedFxIds.has(f.id)) : []),
    [battle, consumedFxIds],
  );

  if (!run || !battle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink text-mist">
        战斗已结束。
      </div>
    );
  }

  const aliveEnemies = battle.enemies.filter((e) => e.hp > 0);
  const isSealChoice = battle.phase === 'sealChoice';
  const sealTargetIdx = battle.enemies.findIndex(
    (e) => e.sealChoiceTriggered && !e.sealed && e.hp > 0,
  );
  const sealTarget = sealTargetIdx >= 0 ? battle.enemies[sealTargetIdx] : null;

  return (
    <div className="relative min-h-screen bg-ink text-parchment overflow-hidden">
      <MistOverlay intensity={0.5} withMoonSpot={false} />

      {/* 敌人区 */}
      <section className="relative pt-8 pb-4 px-6">
        <div className="flex justify-center gap-8 flex-wrap">
          {battle.enemies.map((e, idx) => {
            const intent = intentOf(e);
            const isDead = e.hp <= 0;
            const isTarget = idx === targetIdx;
            return (
              <button
                key={e.instanceId}
                onClick={() => !isDead && setTargetIdx(idx)}
                disabled={isDead}
                className={[
                  'relative flex flex-col items-center transition-opacity no-select',
                  isDead ? 'opacity-25' : '',
                  isTarget && !isDead ? 'ring-2 ring-ember-glow/70 rounded-sm' : '',
                ].join(' ')}
                style={{ padding: 8 }}
              >
                {/* 意图徽章 */}
                {!isDead && intent && (
                  <div className="mb-2 px-2 py-0.5 bg-ink-soft border border-bone/40 rounded-sm font-heading tracking-widest text-sm text-parchment-light">
                    {intent.label}
                  </div>
                )}
                {/* 立绘 */}
                <div
                  className="relative rounded-sm overflow-hidden border border-bone/30"
                  style={{ width: 140, height: 180 }}
                >
                  <Portrait
                    src={e.artSrc}
                    fallbackKind={e.silhouette}
                    sealed={e.sealed}
                    silhouetteVariant="onDark"
                    className="w-full h-full"
                    alt={e.name}
                  />
                  {/* 低血标记 */}
                  {!isDead && e.hp <= e.maxHp * 0.3 && (
                    <div className="absolute top-1 right-1 text-vermillion-light text-xl animate-pulse font-heading">
                      印
                    </div>
                  )}
                </div>
                {/* 名 + 血 */}
                <div className="mt-2 text-center">
                  <div className="font-heading tracking-widest text-parchment-light text-sm">
                    {e.name}
                  </div>
                  <div className="mt-1">
                    <HealthBar current={e.hp} max={e.maxHp} block={e.block} width={140} />
                  </div>
                  <StatusBadges enemy={e} />
                </div>

                {/* 浮动数字 */}
                {activeFx
                  .filter((f) => f.target === 'enemy' && f.enemyIdx === idx)
                  .map((f) => (
                    <FloatingNumber
                      key={f.id}
                      value={f.value}
                      kind={f.kind}
                      offsetX={50}
                      offsetY={40}
                    />
                  ))}
              </button>
            );
          })}
        </div>

        {/* 日志（最后一条） */}
        <div className="mt-4 text-center text-mist text-xs font-heading tracking-widest">
          {battle.log[battle.log.length - 1] ?? ' '}
        </div>
      </section>

      {/* 玩家状态区 */}
      <section className="relative px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs text-mist font-heading tracking-widest mb-1">方 士</div>
            <HealthBar
              current={battle.playerHp}
              max={battle.playerMaxHp}
              block={battle.playerBlock}
              width={220}
            />
            <div className="mt-1">
              <PlayerStatusBadges />
            </div>
            {/* 玩家身上的浮动数字 */}
            <div className="relative">
              {activeFx
                .filter((f) => f.target === 'player')
                .map((f) => (
                  <FloatingNumber
                    key={f.id}
                    value={f.value}
                    kind={f.kind}
                    offsetX={30}
                    offsetY={0}
                  />
                ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <EnergyOrb current={battle.energy} max={battle.energyMax} size={60} />
            <div className="flex flex-col gap-2">
              <Button
                onClick={endTurn}
                disabled={battle.phase !== 'playerAction'}
                size="md"
              >
                结 束 回 合
              </Button>
              <div className="text-mist text-[10px] font-heading tracking-widest text-center">
                回合 {battle.turn}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 手牌区 */}
      <section className="relative mt-4 pb-8 px-4">
        <div className="flex gap-3 justify-center flex-wrap min-h-[260px] items-end">
          {battle.hand.map((c, i) => {
            const canPay = battle.energy >= c.cost;
            return (
              <div
                key={c.uid}
                className={[
                  'transition-transform',
                  canPay ? '' : 'opacity-40 grayscale',
                ].join(' ')}
                style={{ marginBottom: 0 }}
              >
                <Card
                  card={c}
                  width={150}
                  interactive={canPay && battle.phase === 'playerAction'}
                  onClick={
                    canPay && battle.phase === 'playerAction'
                      ? () => playCard(i, targetIdx)
                      : undefined
                  }
                />
              </div>
            );
          })}
          {battle.hand.length === 0 && (
            <div className="text-mist text-sm font-heading tracking-widest">
              · 手 牌 已 尽 ·
            </div>
          )}
        </div>

        {/* 牌堆计数 */}
        <div className="mt-2 max-w-3xl mx-auto flex items-center justify-between text-mist text-xs font-heading tracking-widest">
          <span>抽 牌 {battle.drawPile.length}</span>
          <DeckViewButton />
          <span>弃 牌 {battle.discardPile.length}</span>
        </div>
      </section>

      {/* SEAL_CHOICE 浮层 */}
      {isSealChoice && sealTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-deep/85 backdrop-blur">
          <div className="max-w-md w-full mx-6 p-6 bg-ink-soft border border-bone/50 rounded shadow-card text-center">
            <div className="text-vermillion-light font-heading text-sm tracking-widest mb-2">
              镇 妖 印 现
            </div>
            <h2 className="font-heading text-parchment-light text-2xl tracking-widest mb-3">
              斩 ，抑 或 封 ？
            </h2>
            <p className="text-mist text-sm italic mb-5">"{sealTarget.flavor}"</p>
            <div className="flex flex-col gap-3 items-center">
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={() => chooseSeal(sealTargetIdx, 'kill')}
                >
                  斩
                </Button>
                <Button onClick={() => chooseSeal(sealTargetIdx, 'seal')}>
                  封
                </Button>
              </div>
              <div className="text-mist text-xs font-heading tracking-widest mt-2">
                斩 → 灵气 + 卡牌奖励 ·&nbsp; 封 → 妖卡入组
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 全败浮层保底（phase lost 时上层会跳到 gameOver 屏，不会停留在此） */}
      {aliveEnemies.length === 0 && battle.phase !== 'won' && battle.phase !== 'lost' && (
        <div className="fixed bottom-4 inset-x-0 text-center text-mist text-xs font-heading tracking-widest">
          · 敌 尽 ·
        </div>
      )}
    </div>
  );
}
