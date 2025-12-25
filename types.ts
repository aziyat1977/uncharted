export enum GameState {
  MENU = 'MENU',
  CINEMATIC_INTRO = 'CINEMATIC_INTRO',
  TRANSITION = 'TRANSITION',
  LEVEL_1_AUCTION = 'LEVEL_1_AUCTION',
  LEVEL_2_CRYPT = 'LEVEL_2_CRYPT',
  LEVEL_3_PLANE = 'LEVEL_3_PLANE',
  LEVEL_4_SHIPS = 'LEVEL_4_SHIPS',
  VICTORY = 'VICTORY',
  GAME_OVER = 'GAME_OVER',
}

export interface LevelConfig {
  id: string;
  title: string;
  description: string;
  instruction: string;
}

export interface DeductionChallenge {
  id: string;
  clues: string[];
  artifacts: {
    id: string;
    name: string;
    isCorrect: boolean;
    iconType: 'crown' | 'vase' | 'sword';
    description: string;
  }[];
}

export interface PassiveChallenge {
  id: string;
  segments: string[]; // The scrambled parts
  correctOrder: string[]; // The correct order of IDs or strings
}

export interface PhrasalChallenge {
  id: string;
  sentence: string; // "The plane is taking ___!"
  options: string[]; // ["OFF", "UP", "OUT"]
  correctOption: string;
}

export interface ConditionalChallenge {
  id: string;
  sentencePart1: string;
  sentencePart2: string;
  verbToConjugate: string; // (have)
  correctForm: string; // had
  type: 'Type 2' | 'Type 3';
}