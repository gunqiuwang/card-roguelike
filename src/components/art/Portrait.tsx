/**
 * 立绘加载器 · 有图用图，无图用墨影剪影
 *
 * 用在卡面、标题页、封印动画。
 */

import { useState } from 'react';
import { InkSilhouette } from './InkSilhouette';
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

export function Portrait({ src, fallbackKind, sealed = false, className = '', alt = '' }: Props) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showImage ? (
        <img
          src={src}
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
