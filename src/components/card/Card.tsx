/**
 * 卡牌组件 · 山海经暗黑洪荒 / 内敛史诗
 *
 * 对应用户规范：
 *   R   暗岩纹铜
 *   SR  青纹古铜
 *   SSR 哑光金纹
 *   SP  苍玉玄纹
 *
 * 结构（由外到内）：
 *   Layer A · card-shell          外壳 · 16px 圆角 · 厚度阴影 · hover 上浮
 *   Layer B · card-frame-main     主边框（1px 稀有度主色）· 受光高光 + 暗槽
 *   Layer C · card-frame-muted    内缩亚边（1px edgeMuted · 雕刻分层感）
 *   Layer D · card-body           卡面本体（和纸 + 水墨 + 纸纹）
 *     · 四角暗纹 relic variant opacity 0.3
 *     · 内容分区：能量 / 立绘 / 卡名 / 描述 / 底栏
 */

import type { CSSProperties } from 'react';
import { Portrait } from '../art/Portrait';
import { CornerFlourish } from '../art/CornerFlourish';
import { RarityBadge } from '../art/RarityBadge';
import { rarityTheme } from '../../config/visual';
import type { Card as CardModel, SilhouetteKind } from '../../types';

type Props = {
  card: CardModel;
  /** 渲染宽度（px），高度按 3:4 自动 */
  width?: number;
  /** 可交互：hover 上浮 + 弱柔光 */
  interactive?: boolean;
  /** 已封印妖卡 · 加朱砂"封"字 */
  sealed?: boolean;
  onClick?: () => void;
};

const schoolLabel: Record<CardModel['school'], string> = {
  zhanyao: '斩妖',
  yuling: '御灵',
  fushu: '符术',
  neutral: '',
};

// 派别标签底色 · 暗调，不抢戏
const schoolBgClass: Record<CardModel['school'], string> = {
  zhanyao: 'bg-vermillion-dark',
  yuling: 'bg-jade',
  fushu: 'bg-vermillion-dark',
  neutral: 'bg-mist',
};

const typeLabel: Record<CardModel['type'], string> = {
  fu: '符',
  faqi: '器',
  yao: '妖',
};

export function Card({
  card,
  width = 220,
  interactive = false,
  sealed = false,
  onClick,
}: Props) {
  const height = width * (4 / 3);
  const theme = rarityTheme[card.rarity];

  const fallbackKind: SilhouetteKind =
    card.silhouette ??
    (card.type === 'fu' ? 'talisman' : card.type === 'faqi' ? 'relic' : 'beast');

  // CSS 变量注入，驱动内凹浮雕的颜色
  const shellStyle: CSSProperties = {
    width,
    height,
    fontFamily: 'var(--font-body)',
    ['--edge' as string]: theme.edge,
    ['--edge-muted' as string]: theme.edgeMuted,
    ['--edge-highlight' as string]: theme.highlight,
    ['--edge-shadow' as string]: theme.shadow,
    ['--glow' as string]: theme.glow,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={[
        'card-shell group relative no-select',
        interactive ? 'cursor-pointer is-interactive' : 'cursor-default',
      ].join(' ')}
      style={shellStyle}
      aria-label={card.name}
    >
      {/* ══════════════════════════════════════════════════════════
         Layer B · 主边框（1px 稀有度主色 · 顶部受光 · 底部暗槽）
         ── 通过 inset shadow 营造"雕进去"的分层感
         ════════════════════════════════════════════════════════ */}
      <div className="card-frame-main absolute inset-0 rounded-[16px]" />

      {/* ══════════════════════════════════════════════════════════
         Layer C · 内缩亚边（edgeMuted · 雕刻分层）
         ════════════════════════════════════════════════════════ */}
      <div className="card-frame-muted absolute rounded-[10px] pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════
         Layer D · 卡面本体
         ════════════════════════════════════════════════════════ */}
      <div
        className="absolute rounded-[10px] overflow-hidden bg-parchment"
        style={{ inset: '5px' }}
      >
        {/* 和纸底层渐变（多层提升层次） */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 18%, #D8C8A0 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, #8E8060 0%, transparent 55%), #B3A278',
          }}
        />
        {/* 水墨晕染 */}
        <div className="absolute inset-0 texture-ink-wash opacity-45 pointer-events-none" />
        {/* 纸纹噪点 */}
        <div className="absolute inset-0 texture-paper opacity-60 pointer-events-none" />

        {/* 四角暗纹（relic 山海暗纹，opacity 0.3） */}
        <CornerFlourish
          corner="tl"
          color={theme.pattern}
          size={16}
          opacity={1}
          className="absolute top-1 left-1"
        />
        <CornerFlourish
          corner="tr"
          color={theme.pattern}
          size={16}
          opacity={1}
          className="absolute top-1 right-1"
        />
        <CornerFlourish
          corner="bl"
          color={theme.pattern}
          size={16}
          opacity={1}
          className="absolute bottom-1 left-1"
        />
        <CornerFlourish
          corner="br"
          color={theme.pattern}
          size={16}
          opacity={1}
          className="absolute bottom-1 right-1"
        />

        {/* 内容区域 */}
        <div className="relative w-full h-full flex flex-col" style={{ padding: '9px 11px' }}>
          {/* ── 顶栏：能量 + 类型 ── */}
          <div className="relative flex justify-between items-start" style={{ height: '8%' }}>
            {/* 能量水晶（朱砂，暗底） */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, #B54A3A 0%, #8B2A1E 55%, #4E140A 100%)',
                border: '1.5px solid #0F0E0C',
                boxShadow: '0 1px 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,200,180,0.15)',
                marginLeft: -10,
                marginTop: -8,
              }}
            >
              <span
                className="text-parchment-light font-bold leading-none drop-shadow-[0_1px_0_rgba(0,0,0,0.7)]"
                style={{ fontFamily: 'var(--font-numeric)', fontSize: '16px' }}
              >
                {card.cost}
              </span>
            </div>

            {/* 类型印（右上角） */}
            <span
              className="font-heading text-ink/40 tracking-widest"
              style={{ fontSize: '10px', marginRight: -2, marginTop: -2 }}
            >
              {typeLabel[card.type]}
            </span>
          </div>

          {/* ── 立绘区 ── */}
          <div
            className="relative mt-1 rounded-[5px] overflow-hidden"
            style={{
              height: '54%',
              boxShadow: [
                'inset 0 0 0 1px rgba(15,14,12,0.55)',      // 黑色内框
                'inset 0 1px 0 rgba(255,255,255,0.06)',     // 细受光
                'inset 0 -1px 0 rgba(0,0,0,0.35)',          // 细暗槽
                '0 1px 2px rgba(0,0,0,0.3)',                // 外浮
              ].join(', '),
            }}
          >
            <Portrait
              src={card.artSrc}
              fallbackKind={fallbackKind}
              sealed={sealed}
              className="w-full h-full"
              alt={card.name}
            />
            {/* 立绘底部渐隐到卡面 */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: '22%',
                background:
                  'linear-gradient(to top, rgba(179,162,120,0.7), transparent)',
              }}
            />
          </div>

          {/* ── 卡名 ── */}
          <div className="relative mt-2 flex items-center justify-center" style={{ height: '11%' }}>
            <div
              className="absolute top-0 left-6 right-6 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${theme.edge}88, transparent)`,
              }}
            />
            <h3
              className="font-heading text-ink tracking-[0.15em] leading-none"
              style={{ fontSize: '19px', fontWeight: 600 }}
            >
              {card.name}
            </h3>
            <div
              className="absolute bottom-0 left-6 right-6 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${theme.edge}88, transparent)`,
              }}
            />
          </div>

          {/* ── 描述 ── */}
          <div className="relative mt-2 flex items-center justify-center px-1" style={{ height: '18%' }}>
            <p className="text-center text-ink/85 leading-snug" style={{ fontSize: '12px' }}>
              {card.description}
            </p>
          </div>

          {/* ── flavor ── */}
          {card.flavor && (
            <div className="relative mt-1 flex items-center justify-center px-2" style={{ height: '5%' }}>
              <p
                className="text-center text-ink/45 italic leading-none"
                style={{ fontSize: '10px' }}
              >
                {card.flavor}
              </p>
            </div>
          )}

          {/* ── 底栏：派别 + 徽章 ── */}
          <div className="mt-auto relative flex justify-between items-end" style={{ height: '7%' }}>
            <span
              className={[
                'px-1.5 py-0.5 rounded text-[10px] font-heading text-parchment-light tracking-wide',
                schoolBgClass[card.school],
              ].join(' ')}
              style={{ marginBottom: -4, marginLeft: -4 }}
            >
              {schoolLabel[card.school] || ' '}
            </span>
            <div style={{ marginBottom: -6, marginRight: -6 }}>
              <RarityBadge rarity={card.rarity} size={26} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
         Layer ∞ · 已封印朱砂印
         ════════════════════════════════════════════════════════ */}
      {sealed && (
        <div
          className="absolute pointer-events-none"
          style={{ top: '38%', right: '10%', transform: 'rotate(-8deg)' }}
        >
          <div
            className="px-2 py-0.5 bg-vermillion/85 text-parchment-light font-heading tracking-widest shadow-seal"
            style={{ fontSize: '14px' }}
          >
            封
          </div>
        </div>
      )}
    </button>
  );
}
