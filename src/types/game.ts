// src/types/game.ts

// İsim değişti: ImageData -> GameImage
export interface GameImage {
    id: string;
    url: string;
    isAI: boolean;
    hint: string | null;
}

export type GameMode = 'classic' | 'timeAttack' | 'streak';
export type GameState = 'startScreen' | 'playing' | 'resultScreen';
export type GuessState = 'first' | 'second';

export interface RoundData {
    // Burada da güncelledik
    images: GameImage[];
    aiImageId: string;
    hint: string;
}

export interface ScoreEntry {
    name: string;
    score: number;
    mode: GameMode;
    date: string;
}