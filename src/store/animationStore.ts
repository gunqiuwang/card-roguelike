import { create } from 'zustand';

interface AnimationState {
  enemyShake: boolean;
  playerShake: boolean;
  cardPlayIndex: number | null;
}

interface AnimationStore extends AnimationState {
  triggerEnemyShake: () => void;
  triggerPlayerShake: () => void;
  triggerCardPlay: (index: number) => void;
  clearCardPlay: () => void;
}

export const useAnimationStore = create<AnimationStore>((set) => ({
  enemyShake: false,
  playerShake: false,
  cardPlayIndex: null,

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
    setTimeout(() => set({ cardPlayIndex: null }), 400);
  },

  clearCardPlay: () => {
    set({ cardPlayIndex: null });
  },
}));