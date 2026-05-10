/**
 * 响应式工具 · 根据视口宽度返回合适的卡牌渲染宽度
 *
 * 三档视口：
 *   narrow  : <640  （手机竖屏 375-430 + 小屏）
 *   medium  : 640-1024（iPad 竖屏、手机横屏）
 *   wide    : >=1024（iPad 横屏、桌面）
 *
 * 为何需要：Card 组件的内部像素现已全部随 `width` 成比例缩放
 *（见 FEAT-002 中 `s = width / 220`），但各屏幕依然传的是硬编码
 * 宽度。手机上 width=180 的奖励卡会横溢，width=130 的手牌在
 * iPad 横屏显得过小。此 hook 把“宽度”这个唯一变量抽出来。
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

type Bucket = 'narrow' | 'medium' | 'wide';

const NARROW_BP = 640;
const WIDE_BP = 1024;

const TABLE: Record<ResponsiveMode, Record<Bucket, number>> = {
  hand: { narrow: 110, medium: 125, wide: 140 },
  reward: { narrow: 140, medium: 160, wide: 180 },
  deck: { narrow: 115, medium: 130, wide: 145 },
  shrine: { narrow: 115, medium: 130, wide: 140 },
  overflow: { narrow: 120, medium: 135, wide: 150 },
};

function bucketOf(vw: number): Bucket {
  if (vw < NARROW_BP) return 'narrow';
  if (vw < WIDE_BP) return 'medium';
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
    // 挂载后立刻再读一次，避免初始值错估（SSR 回退 / orientation change）
    setVw(window.innerWidth);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return TABLE[mode][bucketOf(vw)];
}
