import React from 'react';
import type { GameMode } from '../types/game';

interface StartScreenProps {
    onStartGame: (mode: GameMode) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto animate-fade-in text-oyun-text-light">

            {/* Logo ve Başlık Alanı (Daha Kompakt) */}
            <div className="mb-6 text-center transform hover:scale-105 transition-transform duration-500">
                <div className="text-5xl sm:text-6xl mb-2 filter drop-shadow-neon-primary animate-bounce-slow">
                    🕵️‍♂️
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold  bg-clip-text bg-gradient-to-r from-oyun-primary via-white to-oyun-accent font-orbitron drop-shadow-[0_0_10px_rgba(0,245,212,0.5)]">
                    AI DEDEKTİFİ
                </h1>
                <p className="mt-2 text-base sm:text-lg text-oyun-text-dark max-w-lg mx-auto font-light tracking-wide">
                    Gerçek mi, Yapay Zeka mı? <br/>
                    <span className="text-oyun-primary font-bold">Gözlerine ne kadar güveniyorsun?</span>
                </p>
            </div>

            {/* Menü Kartı (Daha Sıkı ve Derli Toplu) */}
            <div className="bg-oyun-kart-dark/80 backdrop-blur-xl p-5 sm:p-8 rounded-2xl shadow-2xl w-full border border-white/10 relative overflow-hidden group-container">

                {/* Süsleme Işıkları */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-oyun-primary/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-oyun-accent/20 rounded-full blur-2xl pointer-events-none"></div>

                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-white/90 font-orbitron uppercase tracking-widest border-b border-white/10 pb-3">
                    Oyun Modunu Seç
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Mod 1: Beyin Avı */}
                    <button
                        onClick={() => onStartGame('classic')}
                        className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 hover:border-oyun-primary transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,245,212,0.3)] hover:-translate-y-1 text-left flex flex-col justify-between h-full"
                    >
                        <div>
                            <div className="text-2xl mb-3 bg-gray-700 w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-oyun-primary group-hover:text-black transition-colors">🧠</div>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-oyun-primary">Beyin Avı</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Klasik mod. Yanlışta ipucu al, tekrar dene.
                            </p>
                        </div>
                        <div className="mt-3 text-oyun-primary text-xs font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            BAŞLA <span className="ml-1">→</span>
                        </div>
                    </button>

                    {/* Mod 2: Zaman Yarışı */}
                    <button
                        onClick={() => onStartGame('timeAttack')}
                        className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 hover:border-oyun-accent transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,168,0.3)] hover:-translate-y-1 text-left flex flex-col justify-between h-full"
                    >
                        <div>
                            <div className="text-2xl mb-3 bg-gray-700 w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-oyun-accent group-hover:text-white transition-colors">⏰</div>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-oyun-accent">Zaman Yarışı</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                60 saniye! İpucu yok, ikinci şans yok. Hızlı ol.
                            </p>
                        </div>
                        <div className="mt-3 text-oyun-accent text-xs font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            YARIŞ <span className="ml-1">→</span>
                        </div>
                    </button>

                    {/* Mod 3: Seri Modu */}
                    <button
                        onClick={() => onStartGame('streak')}
                        className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 hover:border-yellow-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:-translate-y-1 text-left flex flex-col justify-between h-full"
                    >
                        <div>
                            <div className="text-2xl mb-3 bg-gray-700 w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-yellow-400 group-hover:text-black transition-colors">⚡</div>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400">Seri Modu</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Tek yanlışta oyun biter. En uzun seriyi yap!
                            </p>
                        </div>
                        <div className="mt-3 text-yellow-400 text-xs font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            DENE <span className="ml-1">→</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Footer / İmza */}
            <footer className="mt-6 text-oyun-text-dark text-xs opacity-60 hover:opacity-100 transition-opacity">
                <p>Geliştiren: <span className="text-oyun-primary font-bold">Mustafa</span> </p>
            </footer>
        </div>
    );
};

export default StartScreen;