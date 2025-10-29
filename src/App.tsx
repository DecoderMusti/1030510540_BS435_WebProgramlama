import React, { useState, useEffect, useCallback } from 'react';

// --- TİP TANIMLAMALARI ---
interface ImageData {
    id: string;
    url: string;
    isAI: boolean;
    hint: string | null;
}
type GameMode = 'classic' | 'timeAttack';
type GameState = 'startScreen' | 'playing' | 'resultScreen';
type GuessState = 'first' | 'second';
interface RoundData {
    images: ImageData[];
    aiImageId: string;
    hint: string;
}

// --- SAHTE VERİ (MOCK DATA) ---
const allImages: ImageData[] = [
    { id: 'r1', url: 'https://placehold.co/600x600/FFD166/333333?text=Gerçek+Çiçek', isAI: false, hint: null },
    { id: 'r2', url: 'https://placehold.co/600x600/06D6A0/333333?text=Gerçek+Hayvan', isAI: false, hint: null },
    { id: 'r3', url: 'https://placehold.co/600x600/FF6B6B/333333?text=Gerçek+Oyuncak', isAI: false, hint: null },
    { id: 'r4', url: 'https://placehold.co/600x600/4ECDC4/333333?text=Gerçek+Manzara', isAI: false, hint: null },
    { id: 'a1', url: 'https://placehold.co/600x600/EE7B7B/FFFFFF?text=AI+Makyajlı+Yüz', isAI: true, hint: 'Gözler ve dudaklar biraz fazla simetrik mi?' },
    { id: 'a2', url: 'https://placehold.co/600x600/FF9F1C/FFFFFF?text=AI+Fantastik+Hayvan', isAI: true, hint: 'Vücut uzuvları veya tüylerin geçişleri doğal değil.' },
    { id: 'a3', url: 'https://placehold.co/600x600/A0D8B3/FFFFFF?text=AI+Rüya+Evi', isAI: true, hint: 'Pencerelerin veya kapıların konumları gerçekçi olmayabilir.' },
];

/**
 * Yeni tur verisi getiren fonksiyon
 */
const getNewRoundData = (): RoundData => {
    const aiImages = allImages.filter(img => img.isAI);
    const realImages = allImages.filter(img => !img.isAI);
    const aiImage = aiImages[Math.floor(Math.random() * aiImages.length)];
    const shuffledReal = realImages.sort(() => 0.5 - Math.random());
    const twoRealImages = shuffledReal.slice(0, 2);
    const images = [aiImage, ...twoRealImages].sort(() => 0.5 - Math.random());
    return {
        images,
        aiImageId: aiImage.id,
        hint: aiImage.hint || 'Küçük detaylara dikkat etmeyi dene!',
    };
};

// ==================================================================
// --- EKRAN BİLEŞENLERİ ---
// (Artık kendi kendilerini ortalamaya çalışmıyorlar)
// ==================================================================

/**
 * BAŞLANGIÇ EKRANI TASARIMI
 */
interface StartScreenProps {
    onStartGame: (mode: GameMode) => void;
}
const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
    return (
        // DEĞİŞİKLİK: min-h-screen ve justify-center KALDIRILDI.
        // Sadece kendi içeriğine odaklanıyor.
        <div className="flex flex-col items-center text-center p-4 sm:p-8 w-full max-w-4xl animate-fade-in">
            <span className="text-6xl sm:text-7xl mb-6">✨</span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 text-oyun-primary drop-shadow-lg">
                AI Dedektifi!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-oyun-text max-w-2xl mb-8">
                Üç resimden hangisinin yapay zeka tarafından yapıldığını bulabilir misin?
            </p>

            <div className="bg-oyun-kart p-6 sm:p-8 rounded-3xl shadow-2xl mb-10 w-full border-4 border-oyun-accent">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-oyun-primary text-left">Oyun Modları</h2>

                <button
                    onClick={() => onStartGame('classic')}
                    className="group bg-gray-100 p-4 sm:p-6 rounded-2xl mb-4 cursor-pointer transition-all duration-300 hover:bg-oyun-primary hover:shadow-xl hover:scale-105 flex justify-between items-center w-full border-2 border-gray-300"
                >
                    <div className="text-left">
                        <h3 className="text-2xl sm:text-3xl font-extrabold mb-1 flex items-center text-oyun-primary group-hover:text-white">
                            <span className="text-4xl sm:text-5xl mr-4">🧠</span>
                            Beyin Avı
                        </h3>
                        <p className="text-base sm:text-lg text-oyun-text group-hover:text-white">
                            Yanlış yaparsan ipucu alırsın ve bir şansın daha olur.
                        </p>
                    </div>
                    <span className="text-4xl sm:text-5xl">🚀</span>
                </button>

                <button
                    onClick={() => onStartGame('timeAttack')}
                    className="group bg-gray-100 p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-oyun-accent hover:shadow-xl hover:scale-105 flex justify-between items-center w-full border-2 border-gray-300"
                >
                    <div className="text-left">
                        <h3 className="text-2xl sm:text-3xl font-extrabold mb-1 flex items-center text-oyun-primary group-hover:text-white">
                            <span className="text-4xl sm:text-5xl mr-4">⏰</span>
                            Zaman Yarışı
                        </h3>
                        <p className="text-base sm:text-lg text-oyun-text group-hover:text-white">
                            Hızlı ol! İpucu yok, ikinci şans yok. En çok AI'yı yakala!
                        </p>
                    </div>
                    <span className="text-4xl sm:text-5xl">⏳</span>
                </button>
            </div>
        </div>
    );
};

/**
 * OYUN EKRANI TASARIMI
 */
interface GameScreenProps {
    gameMode: GameMode;
    onGameEnd: (wasCorrect: boolean, finalScore?: number) => void;
    score: number;
}
const GameScreen: React.FC<GameScreenProps> = ({ gameMode, onGameEnd, score }) => {
    // --- GameScreen'e Özel Mantıklar (State'ler) ---
    const [roundData, setRoundData] = useState<RoundData | null>(null);
    const [guessState, setGuessState] = useState<GuessState>('first');
    const [hint, setHint] = useState<string | null>(null);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [timer, setTimer] = useState(60);
    const [isPaused, setIsPaused] = useState(false);
    const [animation, setAnimation] = useState('');

    // --- Fonksiyonlar ---
    const loadNewRound = useCallback(() => {
        setRoundData(getNewRoundData());
        setGuessState('first');
        setHint(null);
        setSelectedImageId(null);
        setIsPaused(false);
        setAnimation('');
    }, []);

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
        setIsPaused(true);
        setSelectedImageId(id);
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

    // --- Render ---
    if (!roundData) {
        return <div className="text-3xl">Resimler Yükleniyor...</div>;
    }

    const isRoundOver = (gameMode === 'classic' && (guessState === 'second' && !!selectedImageId)) ||
        (gameMode === 'classic' && (guessState === 'first' && isPaused && !!selectedImageId));

    return (
        // DEĞİŞİKLİK: min-h-screen ve justify-center KALDIRILDI.
        <div className="w-full flex flex-col items-center p-4 sm:p-8 max-w-6xl animate-fade-in">
            {/* Üst Bar */}
            <header className="w-full mb-8 flex justify-between items-center text-lg sm:text-xl md:text-3xl font-extrabold">
                <div>Mod: <span className="text-oyun-primary capitalize">{gameMode === 'classic' ? 'Beyin Avı' : 'Zaman Yarışı'}</span></div>
                <div>Skor: <span className="text-oyun-accent">{score}</span></div>
                {gameMode === 'timeAttack' && (
                    <div className={`flex items-center text-oyun-primary ${timer <= 10 ? 'text-oyun-kirmizi animate-pulse' : ''}`}>
                        <span className="text-2xl sm:text-3xl mr-2">⏰</span>
                        {timer}s
                    </div>
                )}
            </header>

            {/* Başlık */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-oyun-primary drop-shadow-md text-center">
                {gameMode === 'classic' && guessState === 'first' && 'Kim Saklanıyor?'}
                {gameMode === 'classic' && guessState === 'second' && 'İpucunu Kullan, Tekrar Dene!'}
                {gameMode === 'timeAttack' && 'Hızlı Parmaklar, AI Yakalar!'}
            </h1>

            {/* Görsel Izgarası */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 max-w-6xl w-full mb-8 ${animation}`}>
                {roundData.images.map(image => (
                    <ImageCard
                        key={image.id}
                        image={image}
                        onClick={handleImageClick}
                        isDisabled={(guessState === 'second' && image.id === selectedImageId && !image.isAI) || isPaused}
                        isRevealed={isRoundOver || (gameMode === 'timeAttack' && isPaused)}
                        isSelected={image.id === selectedImageId}
                    />
                ))}
            </div>

            {/* İpucu Alanı */}
            {gameMode === 'classic' && hint && (
                <div className="bg-oyun-secondary p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-3xl flex items-center animate-pop-in border-4 border-oyun-primary">
                    <span className="text-4xl sm:text-5xl mr-4">💡</span>
                    <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold mb-1 text-oyun-primary">Psst! İpucu:</h3>
                        <p className="text-base sm:text-lg text-oyun-text">{hint}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * GÖRSEL KARTI TASARIMI
 */
interface ImageCardProps {
    image: ImageData;
    onClick: (id: string) => void;
    isDisabled: boolean;
    isRevealed: boolean;
    isSelected: boolean;
}
const ImageCard: React.FC<ImageCardProps> = ({ image, onClick, isDisabled, isRevealed, isSelected }) => {

    let classes = 'relative w-full aspect-square rounded-2xl shadow-xl transition-all duration-300 transform border-4 sm:border-8';

    if (isDisabled) classes += ' cursor-not-allowed opacity-60';
    else classes += ' cursor-pointer hover:scale-105 hover:shadow-2xl';

    if (isRevealed) {
        if (image.isAI) classes += ' border-oyun-yesil';
        else if (isSelected && !image.isAI) classes += ' border-oyun-kirmizi opacity-70';
        else classes += ' border-transparent opacity-40';
    } else if (isSelected) {
        classes += ' border-oyun-primary scale-102';
    } else {
        classes += ' border-oyun-kart';
    }

    return (
        <div className={classes} onClick={() => !isDisabled && onClick(image.id)}>
            <img src={image.url} alt="Oyun Görseli" className="w-full h-full object-cover rounded-lg" />
            {isRevealed && (
                <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg
          ${image.isAI ? 'text-oyun-yesil' : 'text-oyun-kirmizi'}`}>
                    {image.isAI ? <span className="text-6xl sm:text-8xl">✅</span> : <span className="text-6xl sm:text-8xl">❌</span>}
                </div>
            )}
        </div>
    );
};

/**
 * SONUÇ EKRANI TASARIMI
 */
interface ResultScreenProps {
    wasCorrect: boolean;
    onPlayAgain: () => void;
    onMainMenu: () => void;
    score: number;
    gameMode: GameMode;
}
const ResultScreen: React.FC<ResultScreenProps> = ({ wasCorrect, onPlayAgain, onMainMenu, score, gameMode }) => {
    return (
        // DEĞİŞİKLİK: min-h-screen ve justify-center KALDIRILDI.
        <div className="flex flex-col items-center text-center p-4 sm:p-8 w-full max-w-4xl animate-pop-in">
            {wasCorrect ? (
                <span className="text-7xl sm:text-8xl mb-6">🎉</span>
            ) : (
                <span className="text-7xl sm:text-8xl mb-6">😞</span>
            )}

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 text-oyun-primary drop-shadow-lg">
                {wasCorrect ? 'Harika İş!' : (gameMode === 'timeAttack' && !wasCorrect ? 'Süre Doldu!' : 'Tekrar Dene!')}
            </h1>

            {gameMode === 'timeAttack' ? (
                <p className="text-3xl sm:text-4xl font-extrabold text-oyun-text mb-10">
                    Toplam <span className="text-oyun-accent">{score}</span> AI Bulundu!
                </p>
            ) : (
                <p className="text-xl sm:text-2xl text-oyun-text mb-10">
                    {wasCorrect ? 'Yapay zekayı yakaladın, bravo!' : 'Ah, bu sefer kaçırdın. Ama önemli değil!'}
                </p>
            )}

            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={onPlayAgain}
                    className="bg-oyun-primary hover:bg-oyun-secondary text-white font-extrabold py-2 px-6 sm:py-3 sm:px-8 rounded-full text-lg sm:text-xl transition-all duration-300 shadow-lg hover:scale-105"
                >
                    {gameMode === 'timeAttack' ? 'Yeni Oyun' : 'Yeni Tur'}
                </button>
                <button
                    onClick={onMainMenu}
                    className="bg-oyun-kart hover:bg-gray-300 text-oyun-text font-extrabold py-2 px-6 sm:py-3 sm:px-8 rounded-full text-lg sm:text-xl transition-all duration-300 shadow-lg hover:scale-105"
                >
                    Ana Menüye Dön
                </button>
            </div>
        </div>
    );
};

// ==================================================================
// --- ANA UYGULAMA BİLEŞENİ (YÖNETİCİ) ---
// ==================================================================
const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('startScreen');
    const [gameMode, setGameMode] = useState<GameMode>('classic');
    const [score, setScore] = useState(0);
    const [lastResult, setLastResult] = useState(false);

    const handleStartGame = (mode: GameMode) => {
        setGameMode(mode);
        setScore(0);
        setGameState('playing');
    };

    const handleGameEnd = (wasCorrect: boolean, finalScore?: number) => {
        setLastResult(wasCorrect);
        if (gameMode === 'timeAttack') {
            if(finalScore !== undefined) {
                setScore(finalScore);
            } else if (wasCorrect) {
                setScore(prev => prev + 1);
            }
        } else if (wasCorrect) {
            setScore(prev => prev + 1);
        }
        setGameState('resultScreen');
    };

    const handlePlayAgain = () => {
        if (gameMode === 'timeAttack') {
            setScore(0);
        }
        setGameState('playing');
    };

    const handleMainMenu = () => {
        setGameState('startScreen');
    };

    // Hangi ekranı göstereceğimizi seçen fonksiyon
    const renderCurrentScreen = () => {
        if (gameState === 'startScreen') {
            return <StartScreen onStartGame={handleStartGame} />;
        }
        if (gameState === 'playing') {
            return (
                <GameScreen
                    gameMode={gameMode}
                    onGameEnd={handleGameEnd}
                    score={score}
                />
            );
        }
        if (gameState === 'resultScreen') {
            return (
                <ResultScreen
                    wasCorrect={lastResult}
                    onPlayAgain={handlePlayAgain}
                    onMainMenu={handleMainMenu}
                    score={score}
                    gameMode={gameMode}
                />
            );
        }
        return <div>Yükleniyor...</div>;
    };

    // YENİ YAPI:
    // Bu 'main' etiketi, hangi ekran gelirse gelsin onu
    // dikeyde ve yatayda tam merkeze alacak.
    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
            {renderCurrentScreen()}
        </main>
    );
};


export default App;

