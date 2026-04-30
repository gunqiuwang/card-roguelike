import { create } from 'zustand';
import { Card, Enemy, GameState, GameAction, PlayerState } from '../types';
import { STARTER_DECK, REWARD_CARDS, School } from '../data/cards';
import { getNextIntent, getRandomEnemyByDifficulty, updateBossCharge, getBossUltimateDamage } from '../data/enemies';
import { useAnimationStore } from './animationStore';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createSchoolDeck = (school: School): Card[] => {
  const baseDeck = [...STARTER_DECK];
  const zhanshu = baseDeck.filter(c => c.school === '斩妖');
  const hufu = baseDeck.filter(c => c.school === '御灵');

  switch (school) {
    case '斩妖':
      // 斩妖派：6斩符 + 2护符（偏攻击）
      return [
        ...zhanshu, ...zhanshu.slice(0, 2), // 6斩符
        ...hufu.slice(0, 2), // 2护符
      ];
    case '御灵':
      // 御灵派：2斩符 + 6护符（偏防御）
      return [
        ...zhanshu.slice(0, 2), // 2斩符
        ...hufu, ...hufu.slice(0, 2), // 6护符
      ];
    case '符术':
      // 符术派：3斩符 + 3护符 + 2符术（偏连锁）
      return [
        ...zhanshu.slice(0, 3), // 3斩符
        ...hufu.slice(0, 3), // 3护符
        // 2张符术初始牌
        {
          id: 'fushu-starter-1',
          name: '灵引',
          type: 'skill',
          cost: 0,
          description: '引导灵气，抽1张牌',
          value: 0,
          rarity: 'starter',
          school: '符术',
          drawCards: 1,
        },
        {
          id: 'fushu-starter-2',
          name: '归元',
          type: 'skill',
          cost: 0,
          description: '回归元点，获得1点灵气',
          value: 0,
          rarity: 'starter',
          school: '符术',
          gainEnergy: 1,
        },
      ];
    default:
      return baseDeck;
  }
};

const createInitialPlayerState = (school?: School): PlayerState => {
  const deck = school ? createSchoolDeck(school) : [...STARTER_DECK];
  const shuffledDeck = shuffleArray(deck);
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
  preferredSchool: undefined,

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

              // 斩妖派斩击狂热：连续出斩妖攻击牌，伤害递增
              if (card.comboBonus && card.school === '斩妖') {
                const comboCount = newPlayer.zhanyaoCombo || 0;
                const bonusDamage = comboCount * 3; // 每连击+3伤害
                damage += bonusDamage;
                // 触发斩妖狂热特效
                useAnimationStore.getState().triggerZhanyaoCombo(comboCount + 1);
              }
              // 更新斩妖连击计数
              if (card.comboBonus) {
                newPlayer.zhanyaoCombo = (newPlayer.zhanyaoCombo || 0) + 1;
              }

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

              // 累计本回合伤害（用于Boss打断检测）
              newPlayer.damageDealtThisTurn = (newPlayer.damageDealtThisTurn || 0) + damage;

              // 触发敌人受击动画
              useAnimationStore.getState().triggerEnemyShake();

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
            // 御灵派护体回响：累计护盾值
            if (card.school === '御灵') {
              newPlayer.shieldEcho = (newPlayer.shieldEcho || 0) + card.value;
            }
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

        // 符术派符链机制：累计符术牌，触发共鸣
        if (card.school === '符术') {
          const currentCount = newPlayer.fuchainCount ?? 0;
          if (currentCount >= 0) {
            newPlayer.fuchainCount = currentCount + 1;
            if (newPlayer.fuchainCount >= 3) {
              // 触发符链共鸣
              newPlayer = drawCards(newPlayer, 1);
              newPlayer.energy += 2; // 提升共鸣灵气收益
              newPlayer.fuchainCount = -1; // 防止重复触发
              // 触发动画
              useAnimationStore.getState().triggerFuchain();
            }
          }
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

          // Boss蓄力检测
          if (newEnemy.type === 'boss' && newEnemy.isCharging) {
            // 检查是否被打断（玩家本回合造成 >= 25 伤害）
            const totalDamageThisTurn = newPlayer.damageDealtThisTurn || 0;
            if (totalDamageThisTurn >= 25) {
              // 打断成功
              useAnimationStore.getState().triggerBossInterrupt();
              newEnemy.isCharging = false;
              newEnemy.willUseUltimate = false; // 清除大招标记
              incomingDamage = 0; // 大招被取消
            } else {
              // 未打断，释放大妖神通
              incomingDamage = getBossUltimateDamage(newEnemy.attack);
              useAnimationStore.getState().triggerBossUltimate();
              newEnemy.willUseUltimate = false; // 大招已释放，清除标记
            }
          }

          if (newPlayer.damageReduction) {
            incomingDamage = Math.max(1, incomingDamage - newPlayer.damageReduction);
          }

          if (incomingDamage > 0) {
            const damage = Math.max(0, incomingDamage - newPlayer.block);
            newPlayer.hp = Math.max(0, newPlayer.hp - damage);

            if (newPlayer.lifesteal) {
              const healAmount = Math.floor(incomingDamage * newPlayer.lifesteal);
              newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + healAmount);
            }
          }

          newEnemy.attackReduction = 0;
          // 更新Boss蓄力状态
          newEnemy = updateBossCharge(newEnemy);
          newEnemy.intent = getNextIntent(newEnemy);
        }

        // 下回合获得灵气
        if (newPlayer.pendingEnergyGain) {
          newPlayer.energy += newPlayer.pendingEnergyGain;
          newPlayer.pendingEnergyGain = 0;
        }

        // 御灵派护体回响反击：回响值≥10时，回合结束触发反击
        if (newPlayer.shieldEcho && newPlayer.shieldEcho >= 10 && newEnemy) {
          const echoDamage = Math.floor(newPlayer.shieldEcho * 0.6);
          newEnemy.hp = Math.max(0, newEnemy.hp - echoDamage);
          // 触发护体回响动画
          useAnimationStore.getState().triggerShieldEcho(echoDamage);
        }
        // 清零护体回响
        newPlayer.shieldEcho = 0;

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
          zhanyaoCombo: 0, // 重置斩妖连击
          shieldEcho: 0, // 重置护体回响
          fuchainCount: 0, // 重置符链计数
          damageDealtThisTurn: 0, // 重置本回合伤害
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
        const preferredSchool = (action.payload?.preferredSchool as School | undefined) || get().preferredSchool;
        set({
          player: createInitialPlayerState(preferredSchool),
          enemy: getRandomEnemy(),
          phase: 'battle',
          isPlayerTurn: true,
          turn: 1,
          rewardOptions: [],
          preferredSchool,
        });
        break;
      }

      case 'LOAD_GAME': {
        set({
          player: action.payload.player,
          enemy: action.payload.enemy,
          turn: action.payload.turn,
          isPlayerTurn: action.payload.isPlayerTurn,
          phase: action.payload.phase,
          rewardOptions: [],
          preferredSchool: action.payload.player.deck.length > 8 ? undefined : get().preferredSchool,
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