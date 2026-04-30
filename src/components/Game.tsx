import { Hand } from './Hand';
import { Enemy } from './Enemy';
import { PlayerStats } from './PlayerStats';
import { GameOver } from './GameOver';
import { RewardSelection } from './RewardSelection';
import { BattleArea } from './BattleArea';
import { SaveIndicator } from './SaveIndicator';
import { SoundToggle } from './SoundToggle';
import { StatsDisplay } from './StatsDisplay';

export function Game() {
  return (
    <div
      className="
        min-h-screen h-full
        flex flex-col
        items-center
        pt-14 pb-36
        px-2
        overflow-hidden
      "
      style={{
        background: 'linear-gradient(180deg, #F5EDE0 0%, #E8DFD0 50%, #F5EDE0 100%)',
      }}
    >
      {/* 宣纸纹理背景 */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 战斗区域 */}
      <div className="w-full max-w-md relative z-10">
        <BattleArea />
        <SoundToggle />
      </div>

      {/* 敌人区域 */}
      <div
        className="flex-1 flex items-center justify-center py-4 relative z-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(196, 72, 62, 0.05) 0%, transparent 60%)',
        }}
      >
        <Enemy />
      </div>

      {/* 存档/统计 */}
      <SaveIndicator />
      <StatsDisplay />

      {/* 玩家状态 */}
      <div className="w-full max-w-md px-2 relative z-10">
        <PlayerStats />
      </div>

      {/* 手牌区域 */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <Hand />
      </div>

      {/* 覆盖层 */}
      <GameOver />
      <RewardSelection />
    </div>
  );
}