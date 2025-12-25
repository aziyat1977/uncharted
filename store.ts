import { create } from 'zustand';
import { GameState } from './types';

interface GameStore {
  currentState: GameState;
  nextGameState: GameState | null;
  score: number;
  highScore: number;
  combo: number;
  maxCombo: number;
  adrenalineMode: boolean;
  lives: number;
  currentLevelIndex: number;
  
  // Persistence
  hasSave: boolean;
  init: () => void;
  startNewGame: () => void;
  resumeGame: () => void;

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
  highScore: 0,
  combo: 0,
  maxCombo: 0,
  adrenalineMode: false,
  lives: 3,
  currentLevelIndex: 0,
  godMode: false,
  hasSave: false,

  init: () => {
    const save = localStorage.getItem('uncharted_checkpoint');
    const hs = localStorage.getItem('uncharted_highscore');
    set({ 
      hasSave: !!save,
      highScore: hs ? parseInt(hs) : 0
    });
  },

  startNewGame: () => {
    const initialState = {
      currentState: GameState.LEVEL_1_AUCTION,
      score: 0,
      lives: 3,
      combo: 0,
      adrenalineMode: false
    };
    localStorage.setItem('uncharted_checkpoint', JSON.stringify(initialState));
    set({
      currentState: GameState.LEVEL_1_AUCTION,
      score: 0,
      lives: 3,
      combo: 0,
      adrenalineMode: false,
      hasSave: true
    });
  },

  resumeGame: () => {
    const save = localStorage.getItem('uncharted_checkpoint');
    if (save) {
      try {
        const data = JSON.parse(save);
        set({
          currentState: data.currentState,
          score: data.score,
          lives: data.lives,
          combo: 0, // Reset combo on resume for fair play
          adrenalineMode: false
        });
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
  },

  setGameState: (state) => set({ currentState: state }),
  
  triggerLevelTransition: (next) => set({ currentState: GameState.TRANSITION, nextGameState: next }),
  
  completeTransition: () => set((state) => { 
    const nextState = state.nextGameState || GameState.MENU;
    
    // Save checkpoint if entering a valid level
    if (nextState.startsWith('LEVEL_')) {
        const checkpoint = {
            currentState: nextState,
            score: state.score,
            lives: state.lives,
            combo: 0, 
            adrenalineMode: false
        };
        localStorage.setItem('uncharted_checkpoint', JSON.stringify(checkpoint));
        return { 
            currentState: nextState, 
            nextGameState: null,
            combo: 0,
            adrenalineMode: false,
            hasSave: true
        };
    } else if (nextState === GameState.VICTORY) {
         // Save high score on victory
         const currentHs = parseInt(localStorage.getItem('uncharted_highscore') || '0');
         if (state.score > currentHs) {
             localStorage.setItem('uncharted_highscore', state.score.toString());
         }
         // Clear checkpoint on victory? Or keep it? Let's keep it so they can replay the last level if they want, 
         // or strictly speaking, victory means done. Let's delete checkpoint to avoid confusion.
         localStorage.removeItem('uncharted_checkpoint');
         return {
             currentState: nextState,
             nextGameState: null,
             hasSave: false,
             highScore: Math.max(state.score, currentHs)
         };
    }
    
    return { 
        currentState: nextState, 
        nextGameState: null 
    };
  }),

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
        // Update High Score on Game Over
        const currentHs = parseInt(localStorage.getItem('uncharted_highscore') || '0');
        if (state.score > currentHs) {
            localStorage.setItem('uncharted_highscore', state.score.toString());
        }
        // We DO NOT clear the checkpoint. Player can reload page/menu to resume from start of level.
        return { 
            lives: 0, 
            currentState: GameState.GAME_OVER,
            highScore: Math.max(state.score, currentHs)
        };
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