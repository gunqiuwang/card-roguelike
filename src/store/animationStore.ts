import { create } from 'zustand';

interface AnimationState {
  enemyShake: boolean;
  playerShake: boolean;
  cardPlayIndex: number | null;
  zhanyaoCombo: number; // 斩妖连击数，触发特效用
  shieldEcho: number; // 护体回响反击伤害值
}

interface AnimationStore extends AnimationState {
  triggerEnemyShake: () => void;
  triggerPlayerShake: () => void;
  triggerCardPlay: (index: number) => void;
  clearCardPlay: () => void;
  triggerZhanyaoCombo: (combo: number) => void;
  triggerShieldEcho: (damage: number) => void;
}

export const useAnimationStore = create<AnimationStore>((set) => ({
  enemyShake: false,
  playerShake: false,
  cardPlayIndex: null,
  zhanyaoCombo: 0,
  shieldEcho: 0,

  triggerEnemyShake: () => {
    set({ enemyShake: true });
    setTimeout(() => set({ enemyShake: false }), 400);
  },

  triggerPlayerShake: () => {
    set({ playerShake: true });
    setTimeout(() => set({ playerShake: false }), 400);
  },

  triggerCardPlay: (index: number) => {
    set({ cardPlayIndex: index });
    setTimeout(() => set({ cardPlayIndex: null }), 350);
  },

  clearCardPlay: () => {
    set({ cardPlayIndex: null });
  },

  triggerZhanyaoCombo: (combo: number) => {
    set({ zhanyaoCombo: combo });
    setTimeout(() => set({ zhanyaoCombo: 0 }), 600);
  },

  triggerShieldEcho: (damage: number) => {
    set({ shieldEcho: damage });
    setTimeout(() => set({ shieldEcho: 0 }), 800);
  },
}));