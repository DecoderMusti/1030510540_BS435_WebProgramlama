import React from 'react';
import type { GameMode } from '../types/game';

interface StartScreenProps {
    onStartGame: (mode: GameMode) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
    return (
        <div className="flex flex-col items-center text-center p-4 sm:p-8 w-full max-w-4xl animate-fade-in text-oyun-text-light">
            <span className="text-6xl sm:text-7xl mb-6">🕵️</span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 text-oyun-primary drop-shadow-neon-primary font-orbitron">
                AI DEDEKTİFİ
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-oyun-text-dark max-w-2xl mb-8">
                Üç resimden hangisinin yapay zeka tarafından yapıldığını bulabilir misin?
            </p>

            <div className="bg-oyun-kart-dark p-6 sm:p-8 rounded-3xl shadow-2xl mb-10 w-full border-4 border-oyun-primary">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-oyun-primary text-left font-orbitron">Oyun Modları</h2>

                {/* Mod 1: Beyin Avı */}
                <button
                    onClick={() => onStartGame('classic')}
                    className="group bg-oyun-kart-dark-light p-4 sm:p-6 rounded-2xl mb-4 cursor-pointer transition-all duration-300 hover:bg-oyun-primary hover:shadow-xl hover:scale-105 flex justify-between items-center w-full border-2 border-gray-700"
                >
                    <div className="text-left">
                        <h3 className="text-2xl sm:text-3xl font-extrabold mb-1 flex items-center text-oyun-text-light group-hover:text-oyun-arkaplan">
                            <span className="text-4xl sm:text-5xl mr-4">🧠</span>
                            Beyin Avı
                        </h3>
                        <p className="text-base sm:text-lg text-oyun-text-dark group-hover:text-oyun-arkaplan">
                            Yanlış yaparsan ipucu alırsın ve bir şansın daha olur.
                        </p>
                    </div>
                    <span className="text-4xl sm:text-5xl">🚀</span>
                </button>

                {/* Mod 2: Zaman Yarışı */}
                <button
                    onClick={() => onStartGame('timeAttack')}
                    className="group bg-oyun-kart-dark-light p-4 sm:p-6 rounded-2xl mb-4 cursor-pointer transition-all duration-300 hover:bg-oyun-accent hover:shadow-xl hover:scale-105 flex justify-between items-center w-full border-2 border-gray-700"
                >
                    <div className="text-left">
                        <h3 className="text-2xl sm:text-3xl font-extrabold mb-1 flex items-center text-oyun-text-light group-hover:text-oyun-arkaplan">
                            <span className="text-4xl sm:text-5xl mr-4">⏰</span>
                            Zaman Yarışı
                        </h3>
                        <p className="text-base sm:text-lg text-oyun-text-dark group-hover:text-oyun-arkaplan">
                            Hızlı ol! İpucu yok, ikinci şans yok. En çok AI'yı yakala!
                        </p>
                    </div>
                    <span className="text-4xl sm:text-5xl">⏳</span>
                </button>

                {/* YENİ MOD: Seri Modu */}
                <button
                    onClick={() => onStartGame('streak')}
                    className="group bg-oyun-kart-dark-light p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-oyun-yesil hover:shadow-xl hover:scale-105 flex justify-between items-center w-full border-2 border-gray-700"
                >
                    <div className="text-left">
                        <h3 className="text-2xl sm:text-3xl font-extrabold mb-1 flex items-center text-oyun-text-light group-hover:text-oyun-arkaplan">
                            <span className="text-4xl sm:text-5xl mr-4">⚡</span>
                            Seri Modu
                        </h3>
                        <p className="text-base sm:text-lg text-oyun-text-dark group-hover:text-oyun-arkaplan">
                            Tek bir yanlışta oyun biter. En uzun seriyi yap!
                        </p>
                    </div>
                    <span className="text-4xl sm:text-5xl">🎯</span>
                </button>
            </div>
        </div>
    );
};

export default StartScreen;