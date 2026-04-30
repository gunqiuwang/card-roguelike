// Simulation Runner - Tests actual game logic via store

import { useGameStore } from '../store/gameStore';
import { Card, GamePhase } from '../types';

export interface SimulationReport {
  iteration: number;
  phase: GamePhase;
  playerHp: number;
  enemyHp: number;
  turnsPlayed: number;
  cardsPlayed: string[];
  status: 'running' | 'completed' | 'error';
  errors: string[];
}

function runOneSimulation(): SimulationReport {
  const errors: string[] = [];

  try {
    // Get store state
    const state = useGameStore.getState();

    // Check initial state is valid
    if (!state.player) {
      errors.push('Player state missing');
    }
    if (!state.enemy) {
      errors.push('Enemy state missing');
    }

    const initialPlayerHp = state.player?.hp ?? 0;
    const initialEnemyHp = state.enemy?.hp ?? 0;

    // Play a card if possible
    const hand = state.player?.hand ?? [];
    const energy = state.player?.energy ?? 0;

    let cardsPlayed: string[] = [];
    let playerHp = initialPlayerHp;
    let enemyHp = initialEnemyHp;

    // Find first playable attack card
    const playableCard = hand.find((c: Card) =>
      c.type === 'attack' && (c.cost ?? 0) <= energy
    );

    if (playableCard) {
      const cardIndex = hand.indexOf(playableCard);
      state.dispatch({ type: 'PLAY_CARD', payload: { card: playableCard, cardIndex } });
      cardsPlayed.push(playableCard.name);

      // Get updated state
      const newState = useGameStore.getState();
      playerHp = newState.player?.hp ?? playerHp;
      enemyHp = newState.enemy?.hp ?? enemyHp;
    }

    // Check state consistency
    if (playerHp < 0) errors.push('Player HP went negative');
    if (enemyHp < 0) errors.push('Enemy HP went negative');

    const phase = state.phase ?? 'idle';

    return {
      iteration: 1,
      phase,
      playerHp,
      enemyHp,
      turnsPlayed: state.turn ?? 0,
      cardsPlayed,
      status: errors.length > 0 ? 'error' : 'running',
      errors,
    };
  } catch (e) {
    return {
      iteration: 1,
      phase: 'idle',
      playerHp: 0,
      enemyHp: 0,
      turnsPlayed: 0,
      cardsPlayed: [],
      status: 'error',
      errors: [String(e)],
    };
  }
}

export function runSimulation(): SimulationReport {
  const result = runOneSimulation();
  console.log('=== Simulation Report ===');
  console.log(JSON.stringify(result, null, 2));
  console.log('========================');
  return result;
}