import React, { useState } from 'react';
import type { GameMode, ScoreEntry } from '../types/game';

interface StartScreenProps {
    onStartGame: (mode: GameMode) => void;
    playerName: string;
    setPlayerName: (name: string) => void;
    history: ScoreEntry[];
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, playerName, setPlayerName, history }) => {
    const [showHelp, setShowHelp] = useState(false);
    const [activeTab, setActiveTab] = useState<'ALL' | GameMode>('ALL');

    const getModeLabel = (mode: GameMode) => {
        if (mode === 'classic') return 'Beyin Avı';
        if (mode === 'timeAttack') return 'Zaman Y.';
        if (mode === 'streak') return 'Seri Mod';
        return mode;
    };

    const filteredHistory = history.filter(item => activeTab === 'ALL' || item.mode === activeTab);

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in text-oyun-text-light flex flex-col lg:flex-row gap-6 items-start justify-center relative pt-4">

            {/* NASIL OYNANIR MODALI */}
            {showHelp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowHelp(false)}>
                    <div className="bg-[#1A2035] border border-cyan-500/30 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
                        <h2 className="text-2xl font-bold text-cyan-400 mb-6 font-orbitron text-center border-b border-white/10 pb-4">NASIL OYNANIR?</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-4xl mb-3">🧠</div>
                                <h3 className="font-bold text-cyan-400 mb-2">Beyin Avı</h3>
                                <p className="text-sm text-gray-300">Acele etme. Yanlış yaparsan ipucu alırsın.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-4xl mb-3">⏰</div>
                                <h3 className="font-bold text-pink-500 mb-2">Zaman Yarışı</h3>
                                <p className="text-sm text-gray-300">60 saniye! <span className="text-red-400">Yanlış yapmak süreni 5 saniye azaltır!</span></p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-4xl mb-3">⚡</div>
                                <h3 className="font-bold text-yellow-400 mb-2">Seri Modu</h3>
                                <p className="text-sm text-gray-300">Tek yanlışta oyun biter. Rekor kırmaya çalış.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SOL TARAF: Ana Menü */}
            <div className="flex-1 w-full flex flex-col items-center">

                {/* --- LOGO VE BAŞLIK (KESİN GÖRÜNÜR VERSİYON) --- */}
                <div className="mb-8 text-center transform hover:scale-105 transition-transform duration-500">
                    <div className="text-7xl mb-4 filter drop-shadow-[0_0_15px_rgba(0,245,212,0.6)] animate-bounce-slow">
                        🕵️‍♂️
                    </div>
                    {/* Gradient yerine düz beyaz ve güçlü gölge kullandık, kesin görünür */}
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white font-orbitron tracking-wider drop-shadow-[0_0_20px_rgba(0,245,212,0.8)]">
                        AI DEDEKTİFİ
                    </h1>
                    <p className="mt-2 text-cyan-200 text-sm tracking-widest opacity-80">
                        YAPAY OLANLARI YAKALA
                    </p>
                </div>
                {/* -------------------------------------------------- */}

                {/* İSİM GİRİŞ ALANI */}
                <div className="w-full max-w-lg mb-6">
                    <label className="block text-xs font-bold mb-1 text-cyan-400 ml-1 uppercase tracking-widest">Ajan Kimliği</label>
                    <div className="relative flex items-center group">
                        <span className="absolute left-4 text-xl z-10 group-focus-within:text-cyan-400 transition-colors">🆔</span>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="KOD ADINI GİR..."
                            className="w-full bg-[#111827] text-white border-2 border-gray-600 rounded-xl py-4 pl-12 pr-4 font-bold font-orbitron tracking-widest focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,245,212,0.2)] transition-all uppercase placeholder-gray-600 text-lg"
                            maxLength={12}
                        />
                    </div>
                </div>

                {/* OYUN MODLARI */}
                <div className="bg-[#1A2035]/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-full max-w-lg border border-white/10 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
                        <h2 className="text-lg font-bold text-white font-orbitron uppercase tracking-widest">GÖREV SEÇİMİ</h2>
                        <button
                            onClick={() => setShowHelp(true)}
                            className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/20"
                        >
                            <span>ℹ️</span> Nasıl Oynanır?
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <ModeButton
                            icon="🧠" title="Beyin Avı" desc="İpuçlarını kullan, sakince çöz."
                            color="text-cyan-400" borderColor="hover:border-cyan-400"
                            onClick={() => onStartGame('classic')}
                        />
                        <ModeButton
                            icon="⏰" title="Zaman Yarışı" desc="60sn süre. Hata yapma!"
                            color="text-pink-500" borderColor="hover:border-pink-500"
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

            {/* SAĞ TARAF: Skor Tablosu */}
            <div className="w-full lg:w-80 bg-[#1A2035]/80 backdrop-blur-md rounded-2xl border border-white/5 p-4 h-fit mt-4 lg:mt-0 flex flex-col shadow-xl">
                <h3 className="text-lg font-bold text-center mb-4 flex items-center justify-center gap-2 text-white font-orbitron border-b border-white/5 pb-2">
                    <span>🏆</span> LİDER TABLOSU
                </h3>

                <div className="flex p-1 bg-black/30 rounded-lg mb-3">
                    <TabButton active={activeTab === 'ALL'} onClick={() => setActiveTab('ALL')} label="Tümü" />
                    <TabButton active={activeTab === 'timeAttack'} onClick={() => setActiveTab('timeAttack')} label="Zaman" />
                    <TabButton active={activeTab === 'streak'} onClick={() => setActiveTab('streak')} label="Seri" />
                </div>

                {filteredHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 text-xs italic bg-white/5 rounded-xl border border-white/5 border-dashed">
                        Bu kategoride henüz<br/>görev tamamlanmadı.
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                        <div className="flex text-[10px] font-bold text-gray-500 px-2 mb-1 uppercase tracking-wider justify-between">
                            <span>Ajan</span>
                            <span>Skor</span>
                        </div>

                        {filteredHistory.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg p-2 transition-colors text-sm border border-white/5 group cursor-default">
                                <div className="flex flex-col overflow-hidden">
                                    <span className="font-bold text-white truncate w-24 group-hover:text-cyan-400 transition-colors" title={entry.name}>
                                        {entry.name}
                                    </span>
                                    <span className="text-[10px] text-gray-500">{getModeLabel(entry.mode)}</span>
                                </div>
                                <div className="font-mono font-bold text-cyan-400 text-lg bg-black/30 px-2 rounded min-w-[30px] text-center">
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

// --- YARDIMCI BİLEŞENLER ---

const ModeButton: React.FC<{icon: string, title: string, desc: string, color: string, borderColor: string, onClick: () => void}> =
    ({ icon, title, desc, color, borderColor, onClick }) => (
        <button
            onClick={onClick}
            className={`group relative bg-gradient-to-br from-[#1f2937] to-[#111827] p-4 rounded-xl border border-gray-700 ${borderColor} transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-1 text-left flex items-center justify-between w-full hover:bg-gray-800`}
        >
            <div className="flex items-center">
                <div className={`text-3xl mr-4 bg-gray-700/30 w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-white group-hover:text-black transition-colors shadow-inner`}>{icon}</div>
                <div>
                    <h3 className={`text-base font-bold text-white group-hover:${color} transition-colors uppercase font-orbitron tracking-wide`}>{title}</h3>
                    <p className="text-xs text-gray-400">{desc}</p>
                </div>
            </div>
            <div className={`text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity ${color}`}>
                BAŞLA →
            </div>
        </button>
    );

const TabButton: React.FC<{active: boolean, onClick: () => void, label: string}> = ({active, onClick, label}) => (
    <button
        onClick={onClick}
        className={`flex-1 py-1.5 text-xs rounded-md transition-all ${active ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
        {label}
    </button>
);

export default StartScreen;