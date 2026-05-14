/**
 * 标题页 · v0.2
 *
 * 菜单：继续（若有存档）/ 新开一局 / 图鉴 / 视觉样机
 */

import { Button } from '../ui/Button';
import { Portrait } from '../art/Portrait';
import { MistOverlay } from '../art/MistOverlay';
import { asset } from '../../lib/asset';
import { useGame } from '../../store/GameStore';

type Props = {
  onGotoStyleguide?: () => void;
};

export function TitleScreen({ onGotoStyleguide }: Props) {
  const { hasSavedRun, newRun, continueRun, gotoScreen, meta } = useGame();

  return (
    <div className="relative min-h-screen overflow-hidden texture-ink-wash bg-ink">
      <MistOverlay intensity={1} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(196,85,27,0.08) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(178,58,42,0.06) 0%, transparent 50%)',
        }}
      />

      {/* 符火粒子 */}
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

      {/* 封面大图 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${asset('images/cover.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: 0.15,
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-6 md:gap-10 px-4 sm:px-6 py-10">

        {/* 封面立绘 */}
        <div
          className="relative anim-ink-spread"
          style={{ width: 'min(320px, 75vw)', aspectRatio: '3 / 4' }}
        >
          <div className="absolute inset-0 rounded-sm overflow-hidden border-2 border-ember/50 shadow-seal">
            <Portrait
              src={asset('images/cover.jpg')}
              fallbackKind="hero"
              className="w-full h-full"
              alt="山海志封面"
            />
          </div>
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none rounded-b-sm"
            style={{
              background: 'linear-gradient(to top, rgba(15,14,12,0.95), transparent)',
            }}
          />
        </div>

        {/* 标题文字 */}
        <div
          className="flex flex-col items-center max-w-md anim-ink-spread"
          style={{ animationDelay: '200ms' }}
        >
          <div className="text-bone/80 font-heading tracking-[0.5em] text-sm mb-3">
            山 海 志
          </div>
          <h1
            className="font-heading text-parchment-light leading-none tracking-widest"
            style={{ fontSize: 'clamp(48px, 9vw, 92px)' }}
          >
            封妖录
          </h1>
          <div className="mt-3 relative">
            <div
              className="inline-block px-3 py-1 bg-vermillion text-parchment-light font-heading text-sm tracking-widest shadow-seal"
              style={{ transform: 'rotate(-4deg)' }}
            >
              封
            </div>
          </div>
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

          {/* 菜单 */}
          <div className="mt-10 flex flex-col gap-3 items-center md:items-start">
            {hasSavedRun ? (
              <>
                <Button size="lg" onClick={continueRun}>
                  继 续 这 一 局
                </Button>
                <Button variant="secondary" onClick={newRun}>
                  · 另 启 一 局 ·
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={newRun}>
                踏 入 山 海
              </Button>
            )}
            <Button variant="ghost" onClick={() => gotoScreen('codex')}>
              图 鉴
              {meta.unlockedYao.length > 0 && (
                <span className="ml-2 text-ember-glow font-numeric text-xs">
                  {meta.unlockedYao.length}
                </span>
              )}
            </Button>
            {onGotoStyleguide && (
              <button
                onClick={onGotoStyleguide}
                className="text-bone/60 hover:text-bone text-xs font-heading tracking-widest transition-colors"
              >
                · 视 觉 样 机 ·
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-4 text-mist/50 text-[10px] font-numeric tracking-wider">
        v1.0 · 封妖录
      </div>
      <button
        onClick={() => {
          const { getLocale, setLocale } = (window as unknown as { __i18n: typeof import('../../lib/i18n') }).__i18n;
          const next = getLocale() === 'zh' ? 'en' : 'zh';
          setLocale(next);
          window.location.reload();
        }}
        className="absolute top-3 right-3 text-bone/60 hover:text-bone text-xs font-heading tracking-widest transition-colors"
      >
        中/EN
      </button>
    </div>
  );
}
