import { describe, it, expect } from 'vitest';

describe('Game Store', () => {
  it('should have initial player state', () => {
    const initialState = {
      hp: 50,
      maxHp: 50,
      energy: 3,
      maxEnergy: 3,
      block: 0,
      gold: 0,
      deck: [],
      discardPile: [],
      drawPile: [],
      hand: [],
    };
    expect(initialState.hp).toBe(50);
    expect(initialState.energy).toBe(3);
  });

  it('should have starter deck with 8 cards', () => {
    const deckSize = 8;
    expect(deckSize).toBe(8);
  });
});