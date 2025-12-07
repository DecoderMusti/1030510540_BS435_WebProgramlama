import React from 'react';
import type { GameMode, ScoreEntry } from '../types/game';

interface StartScreenProps {
    onStartGame: (mode: GameMode) => void;
    playerName: string;
    setPlayerName: (name: string) => void;
    history: ScoreEntry[];
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, playerName, setPlayerName, history }) => {

    // Mod ismini kısaltmak için yardımcı fonksiyon
    const getModeLabel = (mode: GameMode) => {
        if (mode === 'classic') return 'Beyin Avı';
        if (mode === 'timeAttack') return 'Zaman Y.';
        if (mode === 'streak') return 'Seri Mod';
        return mode;
    };

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in text-oyun-text-light flex flex-col lg:flex-row gap-8 items-start justify-center">

            {/* SOL TARAF: Ana Menü ve İsim Girişi */}
            <div className="flex-1 w-full flex flex-col items-center">

                {/* Logo */}
                <div className="mb-8 text-center transform hover:scale-105 transition-transform duration-500">
                    <div className="text-6xl mb-2 filter drop-shadow-neon-primary animate-bounce-slow">🕵️‍♂️</div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-oyun-primary via-white to-oyun-accent font-orbitron drop-shadow-[0_0_10px_rgba(0,245,212,0.5)]">
                        AI DEDEKTİFİ
                    </h1>
                </div>

                {/* İsim Giriş Alanı */}
                <div className="w-full max-w-md mb-8">
                    <label className="block text-sm font-bold mb-2 text-oyun-primary ml-1">KOD ADIN NEDİR?</label>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Örn: Ajan Smith"
                        className="w-full bg-oyun-kart-dark/50 border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oyun-primary focus:shadow-[0_0_15px_rgba(0,245,212,0.3)] transition-all font-orbitron tracking-wider text-center text-lg placeholder-gray-500"
                        maxLength={15}
                    />
                </div>

                {/* Oyun Modları */}
                <div className="bg-oyun-kart-dark/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-full max-w-lg border border-white/10 relative overflow-hidden">
                    <h2 className="text-xl font-bold mb-4 text-center text-white/90 font-orbitron uppercase border-b border-white/10 pb-2">
                        GÖREV SEÇİMİ
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        <ModeButton
                            icon="🧠" title="Beyin Avı" desc="Klasik mod. Sakince oyna."
                            color="text-oyun-primary" borderColor="hover:border-oyun-primary"
                            onClick={() => onStartGame('classic')}
                        />
                        <ModeButton
                            icon="⏰" title="Zaman Yarışı" desc="60 saniye! Hızlı ol."
                            color="text-oyun-accent" borderColor="hover:border-oyun-accent"
                            onClick={() => onStartGame('timeAttack')}
                        />
                        <ModeButton
                            icon="⚡" title="Seri Modu" desc="Tek yanlışta oyun biter."
                            color="text-yellow-400" borderColor="hover:border-yellow-400"
                            onClick={() => onStartGame('streak')}
                        />
                    </div>
                </div>
            </div>

            {/* SAĞ TARAF: Son 10 Oyun Listesi */}
            {/* Sadece geçmiş varsa göster */}
            <div className="w-full lg:w-80 bg-oyun-kart-dark/60 backdrop-blur-md rounded-2xl border border-white/5 p-5 h-fit mt-4 lg:mt-0">
                <h3 className="text-lg font-bold text-center mb-4 flex items-center justify-center gap-2 text-oyun-text-light font-orbitron">
                    <span>📋</span> SON GÖREVLER
                </h3>

                {history.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 text-sm italic">
                        Henüz hiç görev tamamlanmadı.<br/>İlk ajan sen ol!
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {/* Başlıklar */}
                        <div className="flex text-xs font-bold text-gray-500 px-3 mb-1 uppercase tracking-wider">
                            <span className="w-24">Ajan</span>
                            <span className="flex-1 text-center">Mod</span>
                            <span className="w-12 text-right">Skor</span>
                        </div>

                        {/* Liste */}
                        {history.map((entry, index) => (
                            <div key={index} className="flex items-center bg-white/5 hover:bg-white/10 rounded-lg p-2 transition-colors text-sm border border-white/5">
                                <div className="w-24 font-bold text-white truncate pr-2" title={entry.name}>
                                    {entry.name}
                                </div>
                                <div className="flex-1 text-center text-xs text-gray-400 bg-black/20 rounded py-1 px-1 truncate">
                                    {getModeLabel(entry.mode)}
                                </div>
                                <div className="w-12 text-right font-mono font-bold text-oyun-primary text-base">
                                    {entry.score}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

// Yardımcı ufak bileşen (Kod tekrarını önlemek için)
const ModeButton: React.FC<{icon: string, title: string, desc: string, color: string, borderColor: string, onClick: () => void}> =
    ({ icon, title, desc, color, borderColor, onClick }) => (
        <button
            onClick={onClick}
            className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-xl border border-gray-700 ${borderColor} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left flex items-center justify-between w-full`}
        >
            <div className="flex items-center">
                <div className={`text-2xl mr-4 bg-gray-700 w-10 h-10 flex items-center justify-center rounded-lg group-hover:bg-white group-hover:text-black transition-colors`}>{icon}</div>
                <div>
                    <h3 className={`text-base font-bold text-white group-hover:${color} transition-colors`}>{title}</h3>
                    <p className="text-xs text-gray-400">{desc}</p>
                </div>
            </div>
            <div className={`text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity ${color}`}>
                →
            </div>
        </button>
    );

export default StartScreen;