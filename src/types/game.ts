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

// YENİ EKLENEN KISIM: Skor Kaydı Tipi
export interface ScoreEntry {
    name: string;
    score: number;
    mode: GameMode;
    date: string; // Hangi tarihte oynadığı
}