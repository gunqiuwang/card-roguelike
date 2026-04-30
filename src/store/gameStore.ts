import { create } from 'zustand';
import { Card, Enemy, GameState, GameAction, PlayerState } from '../types';
import { STARTER_DECK, REWARD_CARDS } from '../data/cards';
import { createEnemy, getNextIntent } from '../data/enemies';
import { ENEMIES } from '../data/enemies';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createInitialPlayerState = (): PlayerState => {
  const shuffledDeck = shuffleArray([...STARTER_DECK]);
  const hand = shuffledDeck.slice(0, 5);
  const drawPile = shuffledDeck.slice(5);
  return {
    hp: 50,
    maxHp: 50,
    energy: 3,
    maxEnergy: 3,
    block: 0,
    gold: 0,
    deck: shuffledDeck,
    discardPile: [],
    drawPile,
    hand,
  };
};

const drawCards = (state: PlayerState, count: number): PlayerState => {
  let { drawPile, hand, discardPile } = state;

  // If not enough cards in draw pile, shuffle discard pile into draw pile
  if (drawPile.length < count) {
    drawPile = [...drawPile, ...shuffleArray(discardPile)];
    discardPile = [];
  }

  // Draw cards
  const drawnCards = drawPile.slice(0, count);
  const remainingDrawPile = drawPile.slice(count);

  return {
    ...state,
    drawPile: remainingDrawPile,
    hand: [...hand, ...drawnCards],
    discardPile,
  };
};

const getRandomRewardCards = (): Card[] => {
  const shuffled = shuffleArray(REWARD_CARDS);
  return shuffled.slice(0, 3);
};

const getRandomEnemy = (): Enemy => {
  const enemyData = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
  return createEnemy(enemyData.name, enemyData.hp, enemyData.attack);
};

interface GameStore extends GameState {
  dispatch: (action: GameAction) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  player: createInitialPlayerState(),
  enemy: getRandomEnemy(),
  phase: 'battle',
  isPlayerTurn: true,
  turn: 1,
  rewardOptions: [],

  dispatch: (action: GameAction) => {
    const state = get();

    switch (action.type) {
      case 'DRAW_CARDS': {
        const newPlayer = drawCards(state.player, action.payload);
        set({ player: newPlayer });
        break;
      }

      case 'PLAY_CARD': {
        const { card, cardIndex } = action.payload;
        if (state.player.energy < card.cost || !state.isPlayerTurn) return;

        let newPlayer = { ...state.player };
        let newEnemy = state.enemy ? { ...state.enemy } : null;

        // Remove card from hand
        newPlayer.hand = newPlayer.hand.filter((_, i) => i !== cardIndex);

        // Spend energy
        newPlayer.energy -= card.cost;

        // Apply card effect
        switch (card.type) {
          case 'attack':
            if (newEnemy) {
              const hits = card.multiHit || 1;
              const totalDamage = card.value * hits;
              newEnemy.hp = Math.max(0, newEnemy.hp - totalDamage);
            }
            break;
          case 'defense':
            newPlayer.block += card.value;
            // Store counter damage for end of turn
            if (card.counterDamage) {
              newPlayer = { ...newPlayer, pendingCounterDamage: card.counterDamage };
            }
            break;
          case 'heal':
            newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + card.value);
            break;
        }

        // Check victory
        if (newEnemy && newEnemy.hp <= 0) {
          set({
            player: newPlayer,
            enemy: newEnemy,
            phase: 'victory',
            rewardOptions: getRandomRewardCards(),
          });
        } else {
          set({ player: newPlayer, enemy: newEnemy });
        }
        break;
      }

      case 'END_TURN': {
        if (!state.isPlayerTurn) return;

        let newPlayer = { ...state.player };
        let newEnemy = state.enemy;

        // Move hand to discard pile
        newPlayer.discardPile = [...newPlayer.discardPile, ...newPlayer.hand];
        newPlayer.hand = [];

        // Enemy action
        if (newEnemy) {
          if (newEnemy.intent === 'attack') {
            const damage = Math.max(0, newEnemy.attack - newPlayer.block);
            newPlayer.hp = Math.max(0, newPlayer.hp - damage);
          }
          // Update enemy intent for next turn
          newEnemy = { ...newEnemy, intent: getNextIntent(newEnemy) };
        }

        // Check defeat
        if (newPlayer.hp <= 0) {
          set({
            player: newPlayer,
            enemy: newEnemy,
            phase: 'defeat',
            isPlayerTurn: false,
          });
        } else {
          set({
            player: newPlayer,
            enemy: newEnemy,
            isPlayerTurn: false,
          });
        }
        break;
      }

      case 'START_TURN': {
        // Restore energy and block
        const newPlayer: PlayerState = {
          ...state.player,
          energy: state.player.maxEnergy,
          block: 0,
        };

        // Draw 5 cards
        let updatedPlayer = drawCards(newPlayer, 5);

        set({
          player: updatedPlayer,
          isPlayerTurn: true,
          turn: state.turn + 1,
        });
        break;
      }

      case 'SELECT_REWARD': {
        const newDeck = [...state.player.deck, action.payload];
        const newEnemy = getRandomEnemy();
        const newPlayer = createInitialPlayerState();
        newPlayer.deck = newDeck;

        set({
          player: newPlayer,
          enemy: newEnemy,
          phase: 'battle',
          isPlayerTurn: true,
          turn: 1,
          rewardOptions: [],
        });
        break;
      }

      case 'RESET_GAME': {
        set({
          player: createInitialPlayerState(),
          enemy: getRandomEnemy(),
          phase: 'battle',
          isPlayerTurn: true,
          turn: 1,
          rewardOptions: [],
        });
        break;
      }

      case 'SET_INTENT': {
        if (state.enemy) {
          set({
            enemy: { ...state.enemy, intent: getNextIntent(state.enemy) },
          });
        }
        break;
      }
    }
  },
}));