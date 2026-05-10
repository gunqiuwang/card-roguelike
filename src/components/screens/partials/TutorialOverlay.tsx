/**
 * 新手教程浮层 · v0.2.1
 *
 * 工作方式：
 *   · self-gate：若 tutorialStep 为 'none'/'done' 直接不渲染
 *   · 每一步通过 data-zone 查询定位一个 UI 区域，高亮它
 *   · 在屏幕底部 / 顶部显示一句话指引 + [知道了]/[跳过]
 *   · 出牌 / 结束回合 / 封妖 这类交互步骤，引擎驱动步进
 *     （在 GameStore.playCard / endTurn / chooseSeal 里 setStep）
 *
 * 对 BattleScreen 的要求：各区块已标 data-zone：
 *   top-bar / player-stats / energy / enemies / enemy-first /
 *   intent / hand / hand-first-card / end-turn / bottom-bar
 */

import { useEffect, useLayoutEffect, useState } from 'react';
import { useGame, type TutorialStep } from '../../../store/GameStore';
import { Button } from '../../ui/Button';

type StepSpec = {
  /** 查询目标 data-zone */
  target?: string;
  title: string;
  body: string;
  /** 是否显示"知道了"按钮自动推进。false 时只能等引擎推进（如出牌） */
  autoAdvance: boolean;
  /** 指引小箭头放在目标的哪一侧 */
  pos: 'top' | 'bottom';
};

const SPECS: Record<TutorialStep, StepSpec | null> = {
  none: null,
  done: null,
  welcome: {
    title: '欢迎踏入山海',
    body: '你是末代封妖司。第一战对手是青狐小妖。\n我将带你过一遍战斗的基本操作。',
    autoAdvance: true,
    pos: 'bottom',
  },
  showHand: {
    target: 'hand',
    title: '手 牌',
    body: '每回合你抽 5 张牌。\n点卡片即可打出，消耗对应的"气"。',
    autoAdvance: true,
    pos: 'top',
  },
  showEnergy: {
    target: 'energy',
    title: '气（能量）',
    body: '每回合重置为 3 点。\n每张卡的左上角数字 = 打出它要花的气。',
    autoAdvance: true,
    pos: 'bottom',
  },
  showIntent: {
    target: 'intent',
    title: '敌 人 意 图',
    body: '敌人头上会显示下一回合它要做什么：\n⚔ 攻击  ·  🛡 防御  ·  🌀 蓄力大招',
    autoAdvance: true,
    pos: 'bottom',
  },
  tryPlay: {
    target: 'hand-first-card',
    title: '出 一 张 牌',
    body: '现在点任意一张能支付的卡试试。\n【烈焰符】造成 6 伤害，【镇魂符】加 5 御。',
    autoAdvance: false,
    pos: 'top',
  },
  tryEndTurn: {
    target: 'end-turn',
    title: '结 束 回 合',
    body: '能打的都打完后，点「结束回合」。\n敌人会行动，然后你抽新的 5 张。',
    autoAdvance: false,
    pos: 'top',
  },
  sealHint: {
    target: 'enemy-first',
    title: '镇 妖 印 现',
    body: '敌 HP ≤ 30% 时，将弹出【斩 / 封】选择。\n斩 → 灵气 + 奖励；封 → 把它变成一张妖卡入组。',
    autoAdvance: false,
    pos: 'bottom',
  },
};

type Rect = { top: number; left: number; width: number; height: number } | null;

export function TutorialOverlay() {
  const { tutorialStep, advanceTutorial, skipTutorial } = useGame();
  const spec = SPECS[tutorialStep];
  const [rect, setRect] = useState<Rect>(null);

  useLayoutEffect(() => {
    if (!spec?.target) {
      setRect(null);
      return;
    }
    const measure = () => {
      const el = document.querySelector<HTMLElement>(`[data-zone="${spec.target}"]`);
      if (!el) {
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    measure();
    // 位置会随 layout 变化（动画、滚动），多次采样
    const t1 = setTimeout(measure, 100);
    const t2 = setTimeout(measure, 400);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [spec?.target, tutorialStep]);

  // 自动轮询，用于 fx 导致 DOM 重排后纠正
  useEffect(() => {
    if (!spec?.target) return;
    const id = setInterval(() => {
      const el = document.querySelector<HTMLElement>(`[data-zone="${spec.target}"]`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect((prev) => {
        if (!prev) return { top: r.top, left: r.left, width: r.width, height: r.height };
        if (
          Math.abs(prev.top - r.top) < 1 &&
          Math.abs(prev.left - r.left) < 1 &&
          Math.abs(prev.width - r.width) < 1 &&
          Math.abs(prev.height - r.height) < 1
        ) {
          return prev;
        }
        return { top: r.top, left: r.left, width: r.width, height: r.height };
      });
    }, 500);
    return () => clearInterval(id);
  }, [spec?.target]);

  if (!spec) return null;

  // 高亮环
  const highlight = rect && (
    <div
      className="fixed pointer-events-none z-[60] rounded-lg ring-4 ring-ember-glow animate-pulse"
      style={{
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
      }}
    />
  );

  // 指引面板位置
  const panelStyle: React.CSSProperties = rect
    ? spec.pos === 'top'
      ? {
          bottom: Math.max(12, window.innerHeight - rect.top + 16),
          left: Math.max(12, Math.min(
            window.innerWidth - 340,
            rect.left + rect.width / 2 - 160,
          )),
        }
      : {
          top: Math.min(window.innerHeight - 220, rect.top + rect.height + 16),
          left: Math.max(12, Math.min(
            window.innerWidth - 340,
            rect.left + rect.width / 2 - 160,
          )),
        }
    : { bottom: 24, left: '50%', transform: 'translateX(-50%)' };

  return (
    <>
      {/* 半透明遮罩（不拦截交互，允许玩家继续操作） */}
      <div
        className="fixed inset-0 pointer-events-none z-[55]"
        style={{ background: 'rgba(15,14,12,0.35)' }}
      />

      {highlight}

      <div
        className="fixed z-[70] w-[320px] max-w-[92vw] bg-ink-soft border-2 border-ember/70 rounded p-4 shadow-seal pointer-events-auto"
        style={panelStyle}
      >
        <div className="text-ember-glow font-heading tracking-widest text-sm mb-1">
          ✦ 指 引
        </div>
        <div className="font-heading text-parchment-light text-lg tracking-widest mb-2">
          {spec.title}
        </div>
        <p className="text-parchment/85 text-sm leading-relaxed whitespace-pre-line mb-4">
          {spec.body}
        </p>
        <div className="flex items-center justify-between gap-2">
          {spec.autoAdvance ? (
            <Button size="sm" onClick={advanceTutorial}>
              知 道 了 →
            </Button>
          ) : (
            <div className="text-mist text-[11px] font-heading tracking-widest italic animate-pulse">
              · 按指引操作 ·
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={skipTutorial}>
            跳 过 教 程
          </Button>
        </div>
      </div>
    </>
  );
}
