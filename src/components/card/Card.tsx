/**
 * 卡牌组件 · 山海经暗黑洪荒 / 内敛史诗
 *
 * 五阶：凡 / 珍 / 灵 / 玄 / 神
 *
 * 结构（由外到内）：
 *   Layer A · card-shell          外壳 · 16px 圆角 · 厚度阴影 · hover 上浮
 *   Layer B · card-metal-band     主边框 · 3px 金属缎面渐变 + 细噪点 + 内外 1px 黑线
 *   Layer C · card-inner-ink      内缩亚边（雕刻分层）
 *   Layer D · card-body           卡面本体（和纸 + 水墨 + 纸纹）
 *     · 四角暗纹 relic variant opacity 0.3
 *     · 内容分区：能量 / 立绘 / 卡名 / 描述 / 底栏
 *
 * 关键修复（用户反馈两条）：
 *   1. 卡名/描述在亚麻底上看不清 ── 字色改纯 100%，加深描边
 *   2. 边框像塑料贴纸 ── 改为 3px 金属带 + 缎面渐变 + 噪点层
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

  // CSS 变量注入（金属缎面）
  const shellStyle: CSSProperties = {
    width,
    height,
    fontFamily: 'var(--font-body)',
    ['--edge' as string]: theme.edge,
    ['--edge-light' as string]: theme.edgeLight,
    ['--edge-dark' as string]: theme.edgeDark,
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
         Layer B · 金属带边框（3px 缎面渐变 + 细噪点 + 内外黑线）
         原理：两层渐变 + mask 只显示边缘 3px
         ════════════════════════════════════════════════════════ */}
      <div className="card-metal-band absolute inset-0 rounded-[16px]" />
      {/* 金属噪点覆层（只覆盖在边框上，给金属肌理） */}
      <div className="card-metal-noise absolute inset-0 rounded-[16px]" />

      {/* ══════════════════════════════════════════════════════════
         Layer C · 亚边（edgeMuted 内缩，雕刻分层）
         ════════════════════════════════════════════════════════ */}
      <div className="card-inner-ink absolute rounded-[10px] pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════
         Layer D · 卡面本体
         ════════════════════════════════════════════════════════ */}
      <div
        className="absolute rounded-[10px] overflow-hidden"
        style={{ inset: '5px' }}
      >
        {/* 和纸底层渐变（已略提亮：字更清） */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 18%, #E3D2A6 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, #9B8B67 0%, transparent 55%), #C1AE82',
          }}
        />
        {/* 水墨晕染（略减，给字让路） */}
        <div className="absolute inset-0 texture-ink-wash opacity-30 pointer-events-none" />
        {/* 纸纹噪点 */}
        <div className="absolute inset-0 texture-paper opacity-55 pointer-events-none" />

        {/* 四角暗纹（opacity 0.3 · 凑近才见） */}
        <CornerFlourish
          corner="tl"
          color={theme.pattern}
          size={18}
          opacity={1}
          className="absolute top-1 left-1"
        />
        <CornerFlourish
          corner="tr"
          color={theme.pattern}
          size={18}
          opacity={1}
          className="absolute top-1 right-1"
        />
        <CornerFlourish
          corner="bl"
          color={theme.pattern}
          size={18}
          opacity={1}
          className="absolute bottom-1 left-1"
        />
        <CornerFlourish
          corner="br"
          color={theme.pattern}
          size={18}
          opacity={1}
          className="absolute bottom-1 right-1"
        />

        {/* 内容区域 */}
        <div className="relative w-full h-full flex flex-col" style={{ padding: '9px 11px' }}>
          {/* ── 顶栏：能量 + 类型 ── */}
          <div className="relative flex justify-between items-start" style={{ height: '8%' }}>
            {/* 能量水晶 */}
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
              className="font-heading tracking-widest"
              style={{
                color: '#2B2218',
                fontSize: '10px',
                marginRight: -2,
                marginTop: -2,
                textShadow: '0 1px 0 rgba(255,240,200,0.35)',
              }}
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
                'inset 0 0 0 1px rgba(15,14,12,0.65)',
                'inset 0 1px 0 rgba(255,255,255,0.07)',
                'inset 0 -1px 0 rgba(0,0,0,0.4)',
                '0 1px 2px rgba(0,0,0,0.35)',
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
                  'linear-gradient(to top, rgba(193,174,130,0.75), transparent)',
              }}
            />
          </div>

          {/* ── 卡名 · 纯黑字 + 浅色 textShadow 让它在任何底上都清晰 ── */}
          <div className="relative mt-2 flex items-center justify-center" style={{ height: '11%' }}>
            <div
              className="absolute top-0 left-6 right-6 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${theme.edge}aa, transparent)`,
              }}
            />
            <h3
              className="font-heading tracking-[0.15em] leading-none"
              style={{
                fontSize: '19px',
                fontWeight: 700,
                color: '#100D08',
                textShadow:
                  '0 1px 0 rgba(255,240,205,0.45), 0 0 3px rgba(255,240,205,0.3)',
              }}
            >
              {card.name}
            </h3>
            <div
              className="absolute bottom-0 left-6 right-6 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${theme.edge}aa, transparent)`,
              }}
            />
          </div>

          {/* ── 描述 · 同样加描边保证可读 ── */}
          <div
            className="relative mt-2 flex items-center justify-center px-1"
            style={{ height: '18%' }}
          >
            <p
              className="text-center leading-snug"
              style={{
                fontSize: '12px',
                color: '#1A140E',
                textShadow: '0 1px 0 rgba(255,240,205,0.35)',
                fontWeight: 500,
              }}
            >
              {card.description}
            </p>
          </div>

          {/* ── flavor ── */}
          {card.flavor && (
            <div className="relative mt-1 flex items-center justify-center px-2" style={{ height: '5%' }}>
              <p
                className="text-center italic leading-none"
                style={{
                  fontSize: '10px',
                  color: '#3E3020',
                  textShadow: '0 1px 0 rgba(255,240,205,0.3)',
                }}
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
