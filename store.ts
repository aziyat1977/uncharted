import { create } from 'zustand';
import { GameState } from './types';

interface GameStore {
  currentState: GameState;
  nextGameState: GameState | null;
  score: number;
  combo: number;
  maxCombo: number;
  adrenalineMode: boolean;
  lives: number;
  currentLevelIndex: number;
  
  // Actions
  setGameState: (state: GameState) => void;
  triggerLevelTransition: (next: GameState) => void;
  completeTransition: () => void;
  addScore: (points: number) => void;
  resetCombo: () => void;
  incrementCombo: () => void;
  loseLife: () => void;
  resetGame: () => void;
  triggerAdrenaline: () => void;
  
  // Teacher Tools
  godMode: boolean;
  toggleGodMode: () => void;
}

const useGameStore = create<GameStore>((set, get) => ({
  currentState: GameState.MENU,
  nextGameState: null,
  score: 0,
  combo: 0,
  maxCombo: 0,
  adrenalineMode: false,
  lives: 3,
  currentLevelIndex: 0,
  godMode: false,

  setGameState: (state) => set({ currentState: state }),
  
  triggerLevelTransition: (next) => set({ currentState: GameState.TRANSITION, nextGameState: next }),
  
  completeTransition: () => set((state) => ({ 
    currentState: state.nextGameState || GameState.MENU, 
    nextGameState: null 
  })),

  addScore: (points) => {
    const multiplier = get().adrenalineMode ? 2 : 1;
    set((state) => ({ score: state.score + (points * multiplier) }));
  },

  incrementCombo: () => {
    set((state) => {
      const newCombo = state.combo + 1;
      const isAdrenaline = newCombo >= 3;
      return { 
        combo: newCombo,
        maxCombo: Math.max(state.maxCombo, newCombo),
        adrenalineMode: isAdrenaline
      };
    });
  },

  resetCombo: () => set({ combo: 0, adrenalineMode: false }),

  loseLife: () => {
    if (get().godMode) return;
    set((state) => {
      const newLives = state.lives - 1;
      if (newLives <= 0) {
        return { lives: 0, currentState: GameState.GAME_OVER };
      }
      return { lives: newLives, combo: 0, adrenalineMode: false };
    });
  },

  resetGame: () => set({
    currentState: GameState.MENU,
    nextGameState: null,
    score: 0,
    combo: 0,
    lives: 3,
    adrenalineMode: false,
    currentLevelIndex: 0
  }),

  triggerAdrenaline: () => set({ adrenalineMode: true }),
  
  toggleGodMode: () => set((state) => ({ godMode: !state.godMode })),
}));

export default useGameStore;