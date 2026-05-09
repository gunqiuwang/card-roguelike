/**
 * 标题页 · 玩家第一眼看到的
 *
 * 核心元素：
 * 1. 方士主角立绘（或 SVG 墨影 fallback）
 * 2. 游戏标题（手书字体 + 朱砂印）
 * 3. 副标题（世界观一句话）
 * 4. "开始" CTA
 * 5. 底部：版本号 + 链接到样机页
 */

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Portrait } from '../art/Portrait';

type Props = {
  onStart?: () => void;
  onGotoStyleguide?: () => void;
};

export function TitleScreen({ onStart, onGotoStyleguide }: Props) {
  const [imgOk] = useState(true); // 让 Portrait 自己处理 fallback

  return (
    <div className="relative min-h-screen overflow-hidden texture-ink-wash bg-ink">
      {/* 背景墨云 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(232,119,34,0.08) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(178,58,42,0.06) 0%, transparent 50%)',
        }}
      />

      {/* 符火粒子（慢漂） */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-ember anim-ember"
            style={{
              left: `${10 + i * 15}%`,
              bottom: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${3 + i * 0.4}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* 主体 · 左立绘 / 右文字（移动端堆叠） */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center min-h-screen gap-8 md:gap-16 px-6 py-10">
        {/* 方士立绘 */}
        <div
          className="relative anim-ink-spread"
          style={{ width: 'min(360px, 80vw)', aspectRatio: '3 / 4' }}
        >
          <div className="absolute inset-0 rounded-sm overflow-hidden border border-bone/40 shadow-card">
            <Portrait
              src={imgOk ? '/images/hero/fangshi_main.webp' : undefined}
              fallbackKind="hero"
              className="w-full h-full"
              alt="方士主角"
            />
          </div>
          {/* 底部暗角，压文字更清 */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none rounded-b-sm"
            style={{
              background:
                'linear-gradient(to top, rgba(15,14,12,0.9), transparent)',
            }}
          />
          {/* 立绘下的小签 */}
          <div className="absolute bottom-3 left-3 text-parchment-light/90 font-heading tracking-widest text-xs">
            方 士 · 末 代 封 妖 司
          </div>
        </div>

        {/* 右侧文字 */}
        <div className="flex flex-col items-center md:items-start max-w-md anim-ink-spread" style={{ animationDelay: '200ms' }}>
          {/* 副标 */}
          <div className="text-bone/80 font-heading tracking-[0.5em] text-sm mb-3">
            山 海 志
          </div>
          {/* 主标 */}
          <h1
            className="font-heading text-parchment-light leading-none tracking-widest"
            style={{ fontSize: 'clamp(48px, 9vw, 92px)' }}
          >
            封妖录
          </h1>
          {/* 朱砂印 */}
          <div className="mt-3 relative">
            <div
              className="inline-block px-3 py-1 bg-vermillion text-parchment-light font-heading text-sm tracking-widest shadow-seal"
              style={{ transform: 'rotate(-4deg)' }}
            >
              封
            </div>
          </div>
          {/* flavor */}
          <p
            className="mt-8 text-parchment/70 leading-relaxed text-center md:text-left"
            style={{ fontSize: '15px' }}
          >
            上古已亡，人间已失。
            <br />
            你拾起一卷残破的封妖录，
            <br />
            走进那片被遗忘的山海。
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-3 items-center md:items-start">
            <Button size="lg" onClick={onStart}>
              踏 入 山 海
            </Button>
            <button
              onClick={onGotoStyleguide}
              className="text-bone/60 hover:text-bone text-xs font-heading tracking-widest transition-colors"
            >
              · 视 觉 样 机 ·
            </button>
          </div>
        </div>
      </div>

      {/* 版本号 */}
      <div className="absolute bottom-3 right-4 text-mist/50 text-[10px] font-numeric tracking-wider">
        v0.1 · Visual Skeleton
      </div>
    </div>
  );
}
