import { Hand } from './Hand';
import { Enemy } from './Enemy';
import { PlayerStats } from './PlayerStats';
import { GameOver } from './GameOver';
import { RewardSelection } from './RewardSelection';
import { BattleArea } from './BattleArea';
import { SaveIndicator } from './SaveIndicator';
import { SoundToggle } from './SoundToggle';

export function Game() {
  return (
    <div className="
      min-h-screen
      bg-gradient-to-b from-[#1A1A2E] to-[#0F0F1A]
      flex flex-col
      items-center
      pt-40
      pb-56
      px-4
    ">
      <BattleArea />
      <SoundToggle />
      <Enemy />
      <SaveIndicator />
      <Hand />
      <PlayerStats />
      <GameOver />
      <RewardSelection />
    </div>
  );
}