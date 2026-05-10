/**
 * 响应式工具 · 根据视口宽度返回合适的卡牌渲染宽度
 *
 * 四档视口（与 Tailwind 断点对齐：sm=640 / md=768 / lg=1024）：
 *   narrow      : <640     手机竖屏（375-430）及更小设备
 *   tablet      : 640-767  手机横屏 / 小平板竖屏（Tailwind sm）
 *   tabletWide  : 768-1023 iPad 竖屏（iPad Mini / Air 768-820）（Tailwind md）
 *   wide        : >=1024   iPad 横屏 / 桌面（Tailwind lg+）
 *
 * 为何分四档：Card 组件的内部像素已全部随 `width` 成比例缩放
 *（见 `s = width / 220`），但各屏幕传的仍是硬编码宽度。Tailwind 的
 * `md:` 断点在 768px 提升了外层 padding/gap，而旧的三档方案让
 * 640-1023 共用同一张表，iPad Mini 竖屏（768）的卡牌因此显得偏小。
 * 新增 `tabletWide` 档把 iPad 竖屏的宽度调整到接近 wide 的中点。
 *
 * SSR 安全：初始化时 `typeof window === 'undefined'` 取 1024 作为
 * 回退视口（wide 档），确保 hydration mismatch 可接受。
 */

import { useEffect, useState } from 'react';

export type ResponsiveMode =
  | 'hand'
  | 'reward'
  | 'deck'
  | 'shrine'
  | 'overflow';

type Bucket = 'narrow' | 'tablet' | 'tabletWide' | 'wide';

const NARROW_BP = 640;
const TABLET_WIDE_BP = 768;
const WIDE_BP = 1024;

const TABLE: Record<ResponsiveMode, Record<Bucket, number>> = {
  hand: { narrow: 110, tablet: 125, tabletWide: 135, wide: 140 },
  reward: { narrow: 140, tablet: 160, tabletWide: 170, wide: 180 },
  deck: { narrow: 115, tablet: 130, tabletWide: 138, wide: 145 },
  shrine: { narrow: 115, tablet: 130, tabletWide: 136, wide: 140 },
  overflow: { narrow: 120, tablet: 135, tabletWide: 142, wide: 150 },
};

export function bucketOf(vw: number): Bucket {
  if (vw < NARROW_BP) return 'narrow';
  if (vw < TABLET_WIDE_BP) return 'tablet';
  if (vw < WIDE_BP) return 'tabletWide';
  return 'wide';
}

function viewportWidth(): number {
  if (typeof window === 'undefined') return 1024;
  return window.innerWidth;
}

/**
 * 返回给定场景下的卡牌推荐宽度。随窗口大小变化自动更新。
 */
export function useResponsiveCardWidth(mode: ResponsiveMode): number {
  const [vw, setVw] = useState<number>(() => viewportWidth());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    // iOS Safari 旋转时 `resize` 偶尔会报旋转前的宽度；
    // 同时监听 `orientationchange` 作为兜底，确保横竖屏切换时宽度正确
    window.addEventListener('orientationchange', onResize);
    // 挂载后立刻再读一次，避免初始值错估（SSR 回退 / orientation change）
    setVw(window.innerWidth);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return TABLE[mode][bucketOf(vw)];
}
