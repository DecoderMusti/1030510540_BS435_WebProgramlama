export interface ImageData {
    id: string;
    url: string;
    isAI: boolean;
    hint: string | null;
}

export type GameMode = 'classic' | 'timeAttack' | 'streak';
export type GameState = 'startScreen' | 'playing' | 'resultScreen';
export type GuessState = 'first' | 'second';

export interface RoundData {
    images: ImageData[];
    aiImageId: string;
    hint: string;
}