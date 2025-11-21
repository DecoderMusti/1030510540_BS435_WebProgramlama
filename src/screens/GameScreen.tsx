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
    const [timer, setTimer] = useState(60);
    const [isPaused, setIsPaused] = useState(false);
    const [animation, setAnimation] = useState('');

    const loadNewRound = useCallback(() => {
        setRoundData(getNewRoundData());
        setGuessState('first');
        setHint(null);
        setSelectedImageId(null);
        setIsPaused(false);
        setAnimation('');
        if(gameMode === 'timeAttack') setTimer(60); // Zamanı sıfırla
    }, [gameMode]);

    useEffect(() => {
        loadNewRound();
    }, [loadNewRound]);

    useEffect(() => {
        if (gameMode !== 'timeAttack' || isPaused) return;
        if (timer <= 0) {
            onGameEnd(false, score);
            return;
        }
        const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [gameMode, timer, isPaused, onGameEnd, score]);

    const handleImageClick = (id: string) => {
        if (isPaused) return;

        setSelectedImageId(id);
        setIsPaused(true); // Tıklama anında oyunu dondur (sonuç gösterimi için)

        const isCorrect = id === roundData?.aiImageId;

        if (gameMode === 'classic') {
            if (guessState === 'first') {
                if (isCorrect) {
                    // İlk hakta doğru -> KAZANDI
                    setTimeout(() => onGameEnd(true), 1500);
                } else {
                    // İlk hakta yanlış -> DEVAM EDİYOR (İpucu ver)
                    setAnimation('shake');
                    setTimeout(() => {
                        setHint(roundData?.hint || '');
                        setGuessState('second');
                        setIsPaused(false); // Tekrar tıklamaya izin ver
                        setAnimation('');
                    }, 1000);
                }
            } else {
                // İkinci hak -> SONUÇ NE OLURSA OLSUN BİTER
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

    // Mod adını belirle
    let modeName = '';
    if (gameMode === 'classic') modeName = 'Beyin Avı';
    else if (gameMode === 'timeAttack') modeName = 'Zaman Yarışı';
    else if (gameMode === 'streak') modeName = 'Seri Modu';

    return (
        <div className="w-full flex flex-col items-center p-4 sm:p-8 max-w-6xl animate-fade-in text-oyun-text-light">
            {/* Üst Bar */}
            <header className="w-full mb-8 flex justify-between items-center text-lg sm:text-xl md:text-3xl font-extrabold">
                <div>Mod: <span className="text-oyun-primary capitalize">{modeName}</span></div>
                <div>Skor: <span className="text-oyun-accent">{score}</span></div>
                {gameMode === 'timeAttack' && (
                    <div className={`flex items-center text-oyun-primary ${timer <= 10 ? 'text-oyun-kirmizi animate-pulse' : ''}`}>
                        <span className="text-2xl sm:text-3xl mr-2">⏰</span>
                        {timer}s
                    </div>
                )}
            </header>

            {/* Başlık */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-oyun-primary drop-shadow-neon-primary font-orbitron text-center">
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

                    // --- KART GÖSTERİM MANTIĞI ---

                    // 1. Kullanıcı bu karta tıkladıysa (Sonuç ne olursa olsun göster)
                    if (isPaused && isSelected) {
                        isRevealed = true;
                    }

                    // 2. Tur tamamen bittiyse HERKESİ göster (AI ve diğerlerini aç)
                    let isRoundOver = false;

                    if (gameMode === 'classic') {
                        // Klasik Modda Tur Bitme Şartları:
                        // a) İkinci tahmin yapıldıysa
                        if (guessState === 'second' && isPaused) isRoundOver = true;
                        // b) İlk tahmin yapıldı VE Doğruysa (Yanlışsa bitmez!)
                        if (guessState === 'first' && isPaused && isSelected && image.id === roundData.aiImageId) isRoundOver = true;
                    } else {
                        // Diğer modlarda pause olduysa tur bitmiştir
                        if (isPaused) isRoundOver = true;
                    }

                    if (isRoundOver) {
                        isRevealed = true;
                    }
                    // -----------------------------

                    // Beyin avında, ikinci haktaysak ve bu kart daha önce seçilmiş (yanlış) kartsa, tıklanamaz olsun.
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