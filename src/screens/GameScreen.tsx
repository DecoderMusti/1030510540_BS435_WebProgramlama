import React, { useState, useEffect, useCallback } from 'react';
import type { GameMode, GuessState, RoundData } from '../types/game';
import { getNewRoundData } from '../utilities/gameLogic';
import ImageCard from '../components/ImageCard';

interface GameScreenProps {
    gameMode: GameMode;
    onGameEnd: (wasCorrect: boolean, finalScore?: number) => void;
    score: number;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameMode, onGameEnd, score }) => {
    const [roundData, setRoundData] = useState<RoundData | null>(null);
    const [guessState, setGuessState] = useState<GuessState>('first');
    const [hint, setHint] = useState<string | null>(null);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [timer, setTimer] = useState(60); // Başlangıç değeri
    const [isPaused, setIsPaused] = useState(false);
    const [animation, setAnimation] = useState('');

    // --- 1. FONKSİYON: Sadece yeni resimleri yükler (Süreye dokunmaz!) ---
    const loadNewRound = useCallback(() => {
        setRoundData(getNewRoundData());
        setGuessState('first');
        setHint(null);
        setSelectedImageId(null);
        setIsPaused(false);
        setAnimation('');
        // DİKKAT: setTimer(60) buradan kaldırıldı! Artık her turda süre sıfırlanmayacak.
    }, []);

    // --- 2. EFFECT: Oyun Başlatıcı (Süreyi Kurar ve İlk Turu Yükler) ---
    useEffect(() => {
        // Eğer mod Zaman Yarışı ise süreyi 60 yap (Sadece oyun başında 1 kere çalışır)
        if (gameMode === 'timeAttack') {
            setTimer(60);
        }
        loadNewRound();
    }, [gameMode, loadNewRound]);

    // --- 3. EFFECT: Sayaç Mantığı ---
    useEffect(() => {
        if (gameMode !== 'timeAttack' || isPaused) return;

        // Süre bittiyse oyunu bitir
        if (timer <= 0) {
            onGameEnd(false, score);
            return;
        }

        // Her saniye azalt
        const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [gameMode, timer, isPaused, onGameEnd, score]);

    const handleImageClick = (id: string) => {
        if (isPaused) return;

        setSelectedImageId(id);
        setIsPaused(true); // Sonuç göstermek için durdur

        const isCorrect = id === roundData?.aiImageId;

        if (gameMode === 'classic') {
            if (guessState === 'first') {
                if (isCorrect) {
                    setTimeout(() => onGameEnd(true), 1500);
                } else {
                    setAnimation('shake');
                    setTimeout(() => {
                        setHint(roundData?.hint || '');
                        setGuessState('second');
                        setIsPaused(false);
                        setAnimation('');
                    }, 1000);
                }
            } else {
                setTimeout(() => onGameEnd(isCorrect), 1500);
            }
        } else if (gameMode === 'streak') {
            if (isCorrect) {
                onGameEnd(true);
                setTimeout(() => loadNewRound(), 1000);
            } else {
                setAnimation('shake');
                setTimeout(() => onGameEnd(false), 1500);
            }
        } else { // TimeAttack
            if (isCorrect) {
                onGameEnd(true);
                setTimeout(() => loadNewRound(), 1000);
            } else {
                setTimer(prev => Math.max(0, prev - 5));
                setAnimation('shake');
                setTimeout(() => {
                    setIsPaused(false);
                    loadNewRound();
                }, 1000);
            }
        }
    };

    if (!roundData) {
        return <div className="text-3xl text-oyun-text-light">Resimler Yükleniyor...</div>;
    }

    let modeName = '';
    if (gameMode === 'classic') modeName = 'Beyin Avı';
    else if (gameMode === 'timeAttack') modeName = 'Zaman Yarışı';
    else if (gameMode === 'streak') modeName = 'Seri Modu';

    return (
        <div className="w-full flex flex-col items-center p-4 sm:p-8 max-w-6xl animate-fade-in text-oyun-text-light">

            {/* --- YENİ EKLENEN KISIM: ANA BAŞLIK (StartScreen ile tutarlı) --- */}
            <div className="mb-4 text-center">
                <div className="text-4xl sm:text-5xl mb-1 filter drop-shadow-neon-primary animate-bounce-slow">🕵️‍♂️</div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-oyun-primary via-white to-oyun-accent font-orbitron drop-shadow-[0_0_8px_rgba(0,245,212,0.5)]">
                    AI DEDEKTİFİ
                </h2>
            </div>
            {/* ---------------------------------------------------------------- */}

            {/* Üst Bar (Skor, Mod, Süre) */}
            <header className="w-full mb-6 flex justify-between items-center text-lg sm:text-xl md:text-2xl font-extrabold bg-oyun-kart-dark/50 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <div>Mod: <span className="text-oyun-primary capitalize">{modeName}</span></div>
                <div>Skor: <span className="text-oyun-accent">{score}</span></div>
                {gameMode === 'timeAttack' && (
                    <div className={`flex items-center text-oyun-primary ${timer <= 10 ? 'text-oyun-kirmizi animate-pulse' : ''}`}>
                        <span className="text-2xl sm:text-3xl mr-2">⏰</span>
                        {timer}s
                    </div>
                )}
            </header>

            {/* Dinamik Alt Başlık (Kim Saklanıyor vb.) */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 text-oyun-primary drop-shadow-neon-primary font-orbitron text-center">
                {gameMode === 'classic' && guessState === 'first' && 'KİM SAKLANIYOR?'}
                {gameMode === 'classic' && guessState === 'second' && 'İPUCUNU KULLAN, TEKRAR DENE!'}
                {gameMode === 'timeAttack' && 'HIZLI PARMAKLAR, AI YAKALAR!'}
                {gameMode === 'streak' && 'SERİYİ BOZMA!'}
            </h1>

            {/* Görsel Izgarası */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 max-w-6xl w-full mb-8 ${animation}`}>
                {roundData.images.map(image => {
                    const isSelected = image.id === selectedImageId;
                    let isRevealed = false;

                    // 1. Kullanıcı tıkladıysa göster
                    if (isPaused && isSelected) isRevealed = true;

                    // 2. Tur bittiyse herkesi göster
                    let isRoundOver = false;
                    if (gameMode === 'classic') {
                        if (guessState === 'second' && isPaused) isRoundOver = true;
                        if (guessState === 'first' && isPaused && isSelected && image.id === roundData.aiImageId) isRoundOver = true;
                    } else {
                        if (isPaused) isRoundOver = true;
                    }
                    if (isRoundOver) isRevealed = true;

                    const isPreviouslyWrongGuess = gameMode === 'classic' && guessState === 'second' && isSelected;

                    return (
                        <ImageCard
                            key={image.id}
                            image={image}
                            onClick={handleImageClick}
                            isDisabled={isPreviouslyWrongGuess || isPaused}
                            isRevealed={isRevealed}
                            isSelected={isSelected}
                        />
                    );
                })}
            </div>

            {/* İpucu Alanı */}
            {gameMode === 'classic' && hint && (
                <div className="bg-oyun-kart-dark p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-3xl flex items-center animate-pop-in border-4 border-oyun-primary">
                    <span className="text-4xl sm:text-5xl mr-4">💡</span>
                    <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold mb-1 text-oyun-primary">Psst! İpucu:</h3>
                        <p className="text-base sm:text-lg text-oyun-text-dark">{hint}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameScreen;