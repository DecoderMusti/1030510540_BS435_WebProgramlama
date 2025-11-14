import React from 'react';
import type { GameMode } from '../types/game';

interface ResultScreenProps {
    wasCorrect: boolean;
    onPlayAgain: () => void;
    onMainMenu: () => void;
    score: number;
    gameMode: GameMode;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ wasCorrect, onPlayAgain, onMainMenu, score, gameMode }) => {

    const isWinner = gameMode === 'classic' && wasCorrect;

    const titleText = isWinner ? 'Harika İş!' :
        (gameMode === 'timeAttack' ? 'Süre Doldu!' :
            (gameMode === 'streak' ? 'Seri Bozuldu!' : 'Tekrar Dene!'));

    return (
        <div className="flex flex-col items-center text-center p-4 sm:p-8 w-full max-w-4xl animate-pop-in text-oyun-text-light">
            {isWinner ? (
                <span className="text-7xl sm:text-8xl mb-6">🏆</span>
            ) : (
                <span className="text-7xl sm:text-8xl mb-6">👾</span>
            )}

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 text-oyun-primary drop-shadow-neon-primary font-orbitron">
                {titleText}
            </h1>

            {/* Skoru moda göre göster */}
            {gameMode === 'classic' ? (
                <p className="text-xl sm:text-2xl text-oyun-text-dark mb-10">
                    {wasCorrect ? 'Yapay zekayı yakaladın, bravo!' : 'Ah, bu sefer kaçırdın. Ama önemli değil!'}
                </p>
            ) : (
                <p className="text-3xl sm:text-4xl font-extrabold text-oyun-text-light mb-10">
                    {gameMode === 'timeAttack' ? 'Toplam ' : 'Seri: '}
                    <span className="text-oyun-accent">{score}</span>
                    {gameMode === 'timeAttack' ? ' AI Bulundu!' : ''}
                </p>
            )}


            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={onPlayAgain}
                    className="bg-oyun-primary hover:bg-oyun-primary-dark text-oyun-arkaplan font-extrabold py-2 px-6 sm:py-3 sm:px-8 rounded-full text-lg sm:text-xl transition-all duration-300 shadow-lg hover:scale-105"
                >
                    {(gameMode === 'timeAttack' || gameMode === 'streak') ? 'Yeni Oyun' : 'Yeni Tur'}
                </button>
                <button
                    onClick={onMainMenu}
                    className="bg-oyun-kart-dark hover:bg-oyun-kart-dark-light text-oyun-text-light font-extrabold py-2 px-6 sm:py-3 sm:px-8 rounded-full text-lg sm:text-xl transition-all duration-300 shadow-lg hover:scale-105"
                >
                    Ana Menüye Dön
                </button>
            </div>
        </div>
    );
};

export default ResultScreen;