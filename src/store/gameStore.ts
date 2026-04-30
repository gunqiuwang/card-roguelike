import { create } from 'zustand';
import { Card, Enemy, GameState, GameAction, PlayerState } from '../types';
import { STARTER_DECK, REWARD_CARDS } from '../data/cards';
import { getNextIntent, getRandomEnemyByDifficulty } from '../data/enemies';

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

  if (drawPile.length < count) {
    drawPile = [...drawPile, ...shuffleArray(discardPile)];
    discardPile = [];
  }

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
  return getRandomEnemyByDifficulty(1);
};

interface GameStore extends GameState {
  dispatch: (action: GameAction) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  player: createInitialPlayerState(),
  enemy: getRandomEnemy(),
  phase: 'idle',
  isPlayerTurn: false,
  turn: 0,
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

        let newPlayer: PlayerState = { ...state.player };
        let newEnemy = state.enemy ? { ...state.enemy } : null;

        // Remove card from hand
        newPlayer.hand = newPlayer.hand.filter((_, i) => i !== cardIndex);

        // Spend energy
        newPlayer.energy -= card.cost;

        // Apply card effect based on type
        switch (card.type) {
          case 'attack':
            if (newEnemy) {
              let damage = card.value;
              if (card.multiHit) {
                damage = card.value * card.multiHit;
              }
              // Apply damage reduction from enemy debuffs
              if (newEnemy.attackReduction) {
                damage = Math.max(1, damage - newEnemy.attackReduction);
              }
              // Check ignoreBlock
              if (!card.ignoreBlock && newPlayer.block > 0) {
                // Block absorbs some damage
                const blockedDamage = Math.min(newPlayer.block, damage);
                newPlayer.block -= blockedDamage;
                damage -= blockedDamage;
              }
              newEnemy.hp = Math.max(0, newEnemy.hp - damage);

              // Apply poison effect (next turn damage reduction)
              if (card.debuffDamage) {
                newEnemy.attackReduction = (newEnemy.attackReduction || 0) + card.debuffDamage;
              }
            }
            break;

          case 'defense':
            newPlayer.block += card.value;
            // Store counter damage for end of turn
            if (card.counterDamage) {
              newPlayer.pendingCounterDamage = card.counterDamage;
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

        let newPlayer: PlayerState = { ...state.player };
        let newEnemy = state.enemy ? { ...state.enemy } : null;

        // Move hand to discard pile
        newPlayer.discardPile = [...newPlayer.discardPile, ...newPlayer.hand];
        newPlayer.hand = [];

        // Apply pending counter damage to enemy
        if (newPlayer.pendingCounterDamage && newEnemy) {
          newEnemy.hp = Math.max(0, newEnemy.hp - newPlayer.pendingCounterDamage);
          newPlayer.pendingCounterDamage = undefined;
        }

        // Enemy action
        if (newEnemy) {
          // Apply damage reduction from结界符
          let incomingDamage = newEnemy.attack;
          if (newPlayer.damageReduction) {
            incomingDamage = Math.max(1, incomingDamage - newPlayer.damageReduction);
          }

          if (newEnemy.intent === 'attack') {
            const damage = Math.max(0, incomingDamage - newPlayer.block);
            newPlayer.hp = Math.max(0, newPlayer.hp - damage);

            // Lifesteal effect
            if (newPlayer.lifesteal) {
              const healAmount = Math.floor(incomingDamage * newPlayer.lifesteal);
              newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + healAmount);
            }
          }

          // Clear attack reduction at end of turn
          newEnemy.attackReduction = 0;

          // Update enemy intent for next turn
          newEnemy.intent = getNextIntent(newEnemy);
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
        const newPlayer: PlayerState = {
          ...state.player,
          energy: state.player.maxEnergy,
          block: 0,
          damageReduction: 0,
          lifesteal: 0,
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