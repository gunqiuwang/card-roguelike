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
    <div className="
      min-h-screen h-full
      bg-gradient-to-b from-[#1A1A2E] to-[#0F0F1A]
      flex flex-col
      items-center
      pt-16 pb-32
      px-2
      overflow-hidden
    ">
      {/* Battle Area - Top */}
      <div className="w-full max-w-md">
        <BattleArea />
        <SoundToggle />
      </div>

      {/* Enemy Area - Middle */}
      <div className="flex-1 flex items-center justify-center py-2">
        <Enemy />
      </div>

      {/* Save/Stats - Right side floating */}
      <SaveIndicator />
      <StatsDisplay />

      {/* Player Stats - Above Hand */}
      <div className="w-full max-w-md px-2">
        <PlayerStats />
      </div>

      {/* Hand - Bottom Fixed */}
      <div className="fixed bottom-0 left-0 right-0">
        <Hand />
      </div>

      {/* Overlays */}
      <GameOver />
      <RewardSelection />
    </div>
  );
}