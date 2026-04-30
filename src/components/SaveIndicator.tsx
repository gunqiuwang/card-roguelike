import { useGameStore } from '../store/gameStore';
import { saveGame, loadGame, clearSave } from '../store/storage';

export function SaveIndicator() {
  const phase = useGameStore(state => state.phase);
  const dispatch = useGameStore(state => state.dispatch);

  const handleSave = () => {
    const state = useGameStore.getState();
    saveGame(state);
    alert('游戏已保存!');
  };

  const handleLoad = () => {
    const saved = loadGame();
    if (saved && saved.state.player && saved.state.enemy) {
      dispatch({
        type: 'LOAD_GAME',
        payload: {
          player: saved.state.player,
          enemy: saved.state.enemy,
          turn: saved.state.turn ?? 1,
          isPlayerTurn: saved.state.isPlayerTurn ?? true,
          phase: saved.state.phase ?? 'battle',
        },
      });
      alert('存档已读取!');
    } else {
      alert('没有找到存档');
    }
  };

  const handleClear = () => {
    if (confirm('确定要删除存档吗?')) {
      clearSave();
      alert('存档已删除');
    }
  };

  if (phase !== 'battle') return null;

  return (
    <div className="fixed top-16 right-2 flex gap-2 z-30">
      <button
        onClick={handleSave}
        className="px-2 py-1 text-xs bg-gray-800 text-white/70 rounded hover:bg-gray-700"
      >
        💾 保存
      </button>
      <button
        onClick={handleLoad}
        className="px-2 py-1 text-xs bg-gray-800 text-white/70 rounded hover:bg-gray-700"
      >
        📂 读取
      </button>
      <button
        onClick={handleClear}
        className="px-2 py-1 text-xs bg-gray-800 text-white/70 rounded hover:bg-gray-700"
      >
        🗑️
      </button>
    </div>
  );
}