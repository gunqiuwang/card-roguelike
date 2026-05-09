/**
 * 立绘加载器 · 有图用图，无图用墨影剪影
 *
 * 用在卡面、标题页、封印动画。
 */

import { useState } from 'react';
import { InkSilhouette } from './InkSilhouette';
import { asset } from '../../lib/asset';
import type { SilhouetteKind } from '../../types';

type Props = {
  /** 立绘路径（public/images/...）。为空或加载失败则显示剪影 */
  src?: string;
  /** 无图时的剪影类型 */
  fallbackKind: SilhouetteKind;
  /** 是否显示封印印章（收服的妖卡） */
  sealed?: boolean;
  className?: string;
  alt?: string;
};

/** 判断 src 是否已经是完整 URL 或已带 base 前缀 */
function normalizeSrc(src: string): string {
  // 外链或 data-url：原样
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  // 已通过 asset() 处理过的（以 base 开头）原样
  const base = import.meta.env.BASE_URL ?? '/';
  if (base !== '/' && src.startsWith(base)) return src;
  // 以 / 开头的 public 绝对路径 → 拼上 base
  if (src.startsWith('/')) return asset(src);
  // 相对路径 → 也拼上 base
  return asset(src);
}

export function Portrait({ src, fallbackKind, sealed = false, className = '', alt = '' }: Props) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;
  const resolvedSrc = src ? normalizeSrc(src) : undefined;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showImage ? (
        <img
          src={resolvedSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setErrored(true)}
          draggable={false}
        />
      ) : (
        <InkSilhouette kind={fallbackKind} className="w-full h-full" withSeal={sealed} />
      )}
    </div>
  );
}
