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
        background: 'linear-gradient(180deg, #1A1128 0%, #251A38 30%, #1A1128 70%, #0D0915 100%)',
      }}
    >
      {/* Background decoration - Castle stone pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(212, 134, 61, 0.5) 50px,
            rgba(212, 134, 61, 0.5) 51px
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            rgba(212, 134, 61, 0.5) 50px,
            rgba(212, 134, 61, 0.5) 51px
          )`,
        }}
      />

      {/* Battle Area - Top with turn indicator */}
      <div className="w-full max-w-md relative z-10">
        <BattleArea />
        <SoundToggle />
      </div>

      {/* Enemy Area - Middle with stage feel */}
      <div
        className="flex-1 flex items-center justify-center py-4 relative z-10"
        style={{
          // Subtle spotlight effect
          background: 'radial-gradient(ellipse at center, rgba(155, 45, 90, 0.1) 0%, transparent 60%)',
        }}
      >
        <Enemy />
      </div>

      {/* Save/Stats - Floating UI elements */}
      <SaveIndicator />
      <StatsDisplay />

      {/* Player Stats - Game HUD */}
      <div className="w-full max-w-md px-2 relative z-10">
        <PlayerStats />
      </div>

      {/* Hand - Bottom with card table feel */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <Hand />
      </div>

      {/* Overlays */}
      <GameOver />
      <RewardSelection />
    </div>
  );
}