import { GameState } from '../types';

const STORAGE_KEY = 'card-roguelike-save';

export interface SavedGame {
  state: Partial<GameState>;
  savedAt: number;
}

export function saveGame(state: GameState): void {
  try {
    const saveData: SavedGame = {
      state: {
        player: state.player,
        enemy: state.enemy,
        phase: state.phase,
        isPlayerTurn: state.isPlayerTurn,
        turn: state.turn,
      },
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.warn('Failed to save game:', e);
  }
}

export function loadGame(): SavedGame | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as SavedGame;
  } catch (e) {
    console.warn('Failed to load game:', e);
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear save:', e);
  }
}

export function hasSavedGame(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}