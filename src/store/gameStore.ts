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
    cardsPlayedThisTurn: 0,
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
        if (!state.isPlayerTurn) return;

        let newPlayer: PlayerState = { ...state.player };
        let newEnemy = state.enemy ? { ...state.enemy } : null;

        // 计算实际费用（考虑降费）
        let actualCost = card.cost;
        if (newPlayer.pendingCostReduction && newPlayer.pendingCostReduction > 0) {
          actualCost = Math.max(0, actualCost - newPlayer.pendingCostReduction);
          newPlayer.pendingCostReduction = 0; // 只生效一次
        }

        if (newPlayer.energy < actualCost) return;

        // 移除卡牌
        newPlayer.hand = newPlayer.hand.filter((_, i) => i !== cardIndex);

        // 消耗能量
        newPlayer.energy -= actualCost;

        // 更新出牌计数
        newPlayer.cardsPlayedThisTurn = (newPlayer.cardsPlayedThisTurn || 0) + 1;

        // 处理连锁抽牌 (无尽符效果)
        if (card.chainDraw && newPlayer.cardsPlayedThisTurn > 0) {
          const chainAmount = card.chainDraw * newPlayer.cardsPlayedThisTurn;
          newPlayer = drawCards(newPlayer, chainAmount);
        }

        // 应用卡牌效果
        switch (card.type) {
          case 'attack':
            if (newEnemy) {
              let damage = card.value;
              if (card.multiHit) {
                damage = card.value * card.multiHit;
              }
              if (newEnemy.attackReduction) {
                damage = Math.max(1, damage - newEnemy.attackReduction);
              }
              if (!card.ignoreBlock && newPlayer.block > 0) {
                const blockedDamage = Math.min(newPlayer.block, damage);
                newPlayer.block -= blockedDamage;
                damage -= blockedDamage;
              }
              newEnemy.hp = Math.max(0, newEnemy.hp - damage);

              if (card.debuffDamage) {
                newEnemy.attackReduction = (newEnemy.attackReduction || 0) + card.debuffDamage;
              }
            }
            // 攻击后抽牌
            if (card.drawCards) {
              newPlayer = drawCards(newPlayer, card.drawCards);
            }
            break;

          case 'defense':
            newPlayer.block += card.value;
            if (card.counterDamage) {
              newPlayer.pendingCounterDamage = card.counterDamage;
            }
            break;

          case 'heal':
            newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + card.value);
            break;

          case 'skill':
            // 抽牌
            if (card.drawCards) {
              newPlayer = drawCards(newPlayer, card.drawCards);
            }
            // 回灵气
            if (card.gainEnergy) {
              newPlayer.energy += card.gainEnergy;
            }
            // 降费标记
            if (card.reduceCost) {
              newPlayer.pendingCostReduction = (newPlayer.pendingCostReduction || 0) + card.reduceCost;
            }
            break;
        }

        // 检查胜利
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

        // 移入手牌到弃牌堆
        newPlayer.discardPile = [...newPlayer.discardPile, ...newPlayer.hand];
        newPlayer.hand = [];

        // 反击伤害
        if (newPlayer.pendingCounterDamage && newEnemy) {
          newEnemy.hp = Math.max(0, newEnemy.hp - newPlayer.pendingCounterDamage);
          newPlayer.pendingCounterDamage = undefined;
        }

        // 敌人行动
        if (newEnemy) {
          let incomingDamage = newEnemy.attack;
          if (newPlayer.damageReduction) {
            incomingDamage = Math.max(1, incomingDamage - newPlayer.damageReduction);
          }

          if (newEnemy.intent === 'attack') {
            const damage = Math.max(0, incomingDamage - newPlayer.block);
            newPlayer.hp = Math.max(0, newPlayer.hp - damage);

            if (newPlayer.lifesteal) {
              const healAmount = Math.floor(incomingDamage * newPlayer.lifesteal);
              newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + healAmount);
            }
          }

          newEnemy.attackReduction = 0;
          newEnemy.intent = getNextIntent(newEnemy);
        }

        // 下回合获得灵气
        if (newPlayer.pendingEnergyGain) {
          newPlayer.energy += newPlayer.pendingEnergyGain;
          newPlayer.pendingEnergyGain = 0;
        }

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
          cardsPlayedThisTurn: 0,
          pendingCostReduction: 0,
        };

        // 抽5张牌
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