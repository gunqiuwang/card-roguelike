/**
 * 卡牌组件 · 对应 docs/ART_BIBLE.md §四 卡面版式规范
 *
 * 3:4 竖版，精修细节：
 *   · 细鎏金双线边（外鎏金 + 内缩暗金）
 *   · 四角极简云纹雕花
 *   · 和纸 + 水墨晕染底
 *   · 右下角稀有度徽章（小而雅，不抢戏）
 *   · 悬浮：轻微上浮 + 投影加深 + 边缘微光一圈
 */

import { Portrait } from '../art/Portrait';
import { CornerFlourish } from '../art/CornerFlourish';
import { RarityBadge } from '../art/RarityBadge';
import type { Card as CardModel, SilhouetteKind } from '../../types';

type Props = {
  card: CardModel;
  /** 渲染尺寸（宽度 px），高度按 3:4 自动算 */
  width?: number;
  /** 是否可交互（悬停上浮 + 边缘微光） */
  interactive?: boolean;
  /** 是否是已封印的妖卡（加朱砂印） */
  sealed?: boolean;
  onClick?: () => void;
};

/** 稀有度 → 外层鎏金边颜色 */
const rarityEdge: Record<CardModel['rarity'], string> = {
  starter: '#A68C5B',       // bone
  common: '#6B7C6B',        // jade 淡
  rare: '#D4B87A',          // bone-light
  epic: '#E0C486',          // 鎏金高亮
  legend: '#F0D69A',        // 偏金，+ CSS 光晕
};

/** 悬浮时的边缘微光色（光圈） */
const rarityGlow: Record<CardModel['rarity'], string> = {
  starter: 'rgba(166,140,91,0.35)',
  common: 'rgba(74,93,74,0.35)',
  rare: 'rgba(212,184,122,0.45)',
  epic: 'rgba(224,196,134,0.55)',
  legend: 'rgba(240,214,154,0.7)',
};

const schoolLabel: Record<CardModel['school'], string> = {
  zhanyao: '斩妖',
  yuling: '御灵',
  fushu: '符术',
  neutral: '',
};

const schoolBgClass: Record<CardModel['school'], string> = {
  zhanyao: 'bg-vermillion',
  yuling: 'bg-jade',
  fushu: 'bg-ember',
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
  const edgeColor = rarityEdge[card.rarity];
  const glowColor = rarityGlow[card.rarity];

  const fallbackKind: SilhouetteKind =
    card.silhouette ??
    (card.type === 'fu' ? 'talisman' : card.type === 'faqi' ? 'relic' : 'beast');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={[
        'card-shell group relative no-select',
        interactive ? 'cursor-pointer' : 'cursor-default',
      ].join(' ')}
      style={
        {
          width,
          height,
          fontFamily: 'var(--font-body)',
          '--card-edge': edgeColor,
          '--card-glow': glowColor,
        } as React.CSSProperties
      }
      aria-label={card.name}
    >
      {/* ══════════════════════════════════════════════════════════
         层 L0 · 外层鎏金细边（1px）+ 悬浮外发光
         ════════════════════════════════════════════════════════ */}
      <div className="card-outer-edge absolute inset-0 rounded-[13px] pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════
         层 L1 · 卡面主体（和纸 + 水墨晕染）
         ════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-[1.5px] rounded-[11px] overflow-hidden bg-parchment"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(15,14,12,0.35)' }}
      >
        {/* 底层 和纸渐变（比纯色更有层次） */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, #E0D2AB 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, #9D8F6F 0%, transparent 60%), #C9B890',
          }}
        />
        {/* 水墨晕染 */}
        <div className="absolute inset-0 texture-ink-wash opacity-35 pointer-events-none" />
        {/* 纸纹噪点 */}
        <div className="absolute inset-0 texture-paper opacity-55 pointer-events-none" />

        {/* ══════════════════════════════════════════════════════
           层 L2 · 内缩暗金线（细双线效果）
           ══════════════════════════════════════════════════════ */}
        <div
          className="absolute rounded-[8px] pointer-events-none"
          style={{
            inset: '6px',
            border: '1px solid rgba(166,140,91,0.45)',
            boxShadow: 'inset 0 0 18px rgba(93,75,40,0.08)',
          }}
        />

        {/* ══════════════════════════════════════════════════════
           层 L3 · 四角云纹
           ══════════════════════════════════════════════════════ */}
        <CornerFlourish corner="tl" color={edgeColor} size={16} opacity={0.75} className="absolute top-1.5 left-1.5" />
        <CornerFlourish corner="tr" color={edgeColor} size={16} opacity={0.75} className="absolute top-1.5 right-1.5" />
        <CornerFlourish corner="bl" color={edgeColor} size={16} opacity={0.6} className="absolute bottom-1.5 left-1.5" />
        <CornerFlourish corner="br" color={edgeColor} size={16} opacity={0.6} className="absolute bottom-1.5 right-1.5" />

        {/* ══════════════════════════════════════════════════════
           内容区域（相对内边距）
           ══════════════════════════════════════════════════════ */}
        <div className="relative w-full h-full flex flex-col" style={{ padding: '10px 12px' }}>
          {/* ── 顶栏：能量 + 类型标签 ── */}
          <div className="relative flex justify-between items-start" style={{ height: '8%' }}>
            {/* 能量水晶 */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-seal"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #D15040 0%, #B23A2A 55%, #6B1A10 100%)',
                border: '1.5px solid #0F0E0C',
                marginLeft: -10,
                marginTop: -8,
              }}
            >
              <span
                className="text-parchment-light font-bold leading-none drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]"
                style={{ fontFamily: 'var(--font-numeric)', fontSize: '16px' }}
              >
                {card.cost}
              </span>
            </div>

            {/* 类型印（右上角小字） */}
            <span
              className="font-heading text-ink/40 tracking-widest"
              style={{ fontSize: '10px', marginRight: -4, marginTop: -2 }}
            >
              {typeLabel[card.type]}
            </span>
          </div>

          {/* ── 立绘区 ── */}
          <div
            className="relative mt-1 rounded-[6px] overflow-hidden"
            style={{
              height: '54%',
              boxShadow:
                'inset 0 0 0 1px rgba(166,140,91,0.6), inset 0 0 0 2px rgba(15,14,12,0.4), 0 1px 3px rgba(0,0,0,0.35)',
            }}
          >
            <Portrait
              src={card.artSrc}
              fallbackKind={fallbackKind}
              sealed={sealed}
              className="w-full h-full"
              alt={card.name}
            />
            {/* 立绘底部渐隐到卡面，帮卡名悬浮不突兀 */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: '22%',
                background:
                  'linear-gradient(to top, rgba(201,184,144,0.55), transparent)',
              }}
            />
          </div>

          {/* ── 卡名 ── */}
          <div className="relative mt-2 flex items-center justify-center" style={{ height: '11%' }}>
            {/* 卡名上下的极细装饰线 */}
            <div className="absolute top-0 left-6 right-6 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(166,140,91,0.5), transparent)' }} />
            <h3
              className="font-heading text-ink tracking-[0.15em] leading-none"
              style={{ fontSize: '19px', fontWeight: 600 }}
            >
              {card.name}
            </h3>
            <div className="absolute bottom-0 left-6 right-6 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(166,140,91,0.5), transparent)' }} />
          </div>

          {/* ── 描述 ── */}
          <div className="relative mt-2 flex items-center justify-center px-1" style={{ height: '18%' }}>
            <p
              className="text-center text-ink/85 leading-snug"
              style={{ fontSize: '12px' }}
            >
              {card.description}
            </p>
          </div>

          {/* ── flavor（可选，只在空间够时显示） ── */}
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
            {/* 稀有度徽章 · 右下角 */}
            <div style={{ marginBottom: -6, marginRight: -6 }}>
              <RarityBadge rarity={card.rarity} size={26} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
         层 L∞ · 已封印朱砂印（覆盖在最顶层）
         ════════════════════════════════════════════════════════ */}
      {sealed && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: '38%',
            right: '10%',
            transform: 'rotate(-8deg)',
          }}
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
