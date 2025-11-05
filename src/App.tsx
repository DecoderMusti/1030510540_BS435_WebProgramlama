import React, { useState, useEffect, useCallback } from 'react';

// --- TİP TANIMLAMALARI ---
interface ImageData {
    id: string;
    url: string;
    isAI: boolean;
    hint: string | null;
}
// YENİ OYUN MODU EKLENDİ
type GameMode = 'classic' | 'timeAttack' | 'streak';
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
    // ... (Bu fonksiyon değişmedi)
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
// --- EKRAN BİLEŞENLERİ (YENİ TASARIM) ---
// ==================================================================

/**
 * BAŞLANGIÇ EKRANI TASARIMI
 */
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

/**
 * OYUN EKRANI TASARIMI
 */
interface GameScreenProps {
    gameMode: GameMode;
    onGameEnd: (wasCorrect: boolean, finalScore?: number) => void;
    score: number;
}
const GameScreen: React.FC<GameScreenProps> = ({ gameMode, onGameEnd, score }) => {
    // ... (State'ler değişmedi)
    const [roundData, setRoundData] = useState<RoundData | null>(null);
    const [guessState, setGuessState] = useState<GuessState>('first');
    const [hint, setHint] = useState<string | null>(null);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [timer, setTimer] = useState(60);
    const [isPaused, setIsPaused] = useState(false);
    const [animation, setAnimation] = useState('');

    // ... (loadNewRound ve timer useEffect değişmedi)
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

    // YENİ MOD İÇİN GÜNCELLENDİ
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
        } else if (gameMode === 'streak') {
            if (isCorrect) {
                // Doğru, skoru artır (App'ta) ve yeni tura geç
                onGameEnd(true);
                setTimeout(() => loadNewRound(), 1000);
            } else {
                // Yanlış, oyun bitti
                setAnimation('shake');
                setTimeout(() => onGameEnd(false), 1500);
            }
        } else { // TimeAttack
            if (isCorrect) {
                onGameEnd(true); // Skoru artır (App'ta)
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
        return <div className="text-3xl text-oyun-text-light">Resimler Yükleniyor...</div>;
    }

    const isRoundOver = (gameMode === 'classic' && (guessState === 'second' && !!selectedImageId)) ||
        (gameMode === 'classic' && (guessState === 'first' && isPaused && !!selectedImageId));

    // Mod adını belirle
    let modeName = '';
    if (gameMode === 'classic') modeName = 'Beyin Avı';
    else if (gameMode === 'timeAttack') modeName = 'Zaman Yarışı';
    else if (gameMode === 'streak') modeName = 'Seri Modu';

    return (
        <div className="w-full flex flex-col items-center p-4 sm:p-8 max-w-6xl animate-fade-in text-oyun-text-light">
            {/* Üst Bar (Tasarım Güncellendi) */}
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

            {/* Başlık (Tasarım Güncellendi) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-oyun-primary drop-shadow-neon-primary font-orbitron text-center">
                {gameMode === 'classic' && guessState === 'first' && 'KİM SAKLANIYOR?'}
                {gameMode === 'classic' && guessState === 'second' && 'İPUCUNU KULLAN, TEKRAR DENE!'}
                {gameMode === 'timeAttack' && 'HIZLI PARMAKLAR, AI YAKALAR!'}
                {gameMode === 'streak' && 'SERİYİ BOZMA!'}
            </h1>

            {/* Görsel Izgarası */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 max-w-6xl w-full mb-8 ${animation}`}>
                {roundData.images.map(image => (
                    <ImageCard
                        key={image.id}
                        image={image}
                        onClick={handleImageClick}
                        isDisabled={(guessState === 'second' && image.id === selectedImageId && !image.isAI) || isPaused}
                        isRevealed={isRoundOver || (gameMode !== 'classic' && isPaused)}
                        isSelected={image.id === selectedImageId}
                    />
                ))}
            </div>

            {/* İpucu Alanı (Tasarım Güncellendi) */}
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

/**
 * GÖRSEL KARTI TASARIMI (Tasarım Güncellendi)
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
    else classes += ' cursor-pointer hover:scale-105 hover:shadow-2xl hover:border-oyun-primary-light';

    if (isRevealed) {
        if (image.isAI) classes += ' border-oyun-yesil'; // Cyan
        else if (isSelected && !image.isAI) classes += ' border-oyun-kirmizi opacity-70'; // Pink
        else classes += ' border-transparent opacity-40';
    } else if (isSelected) {
        classes += ' border-oyun-primary scale-102'; // Cyan
    } else {
        classes += ' border-oyun-kart-dark-light'; // Koyu gri
    }

    return (
        <div className={classes} onClick={() => !isDisabled && onClick(image.id)}>
            <img src={image.url} alt="Oyun Görseli" className="w-full h-full object-cover rounded-lg" />
            {isRevealed && (
                <div className={`absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg
                  ${image.isAI ? 'text-oyun-yesil' : 'text-oyun-kirmizi'}`}>
                    {image.isAI ? <span className="text-6xl sm:text-8xl">✅</span> : <span className="text-6xl sm:text-8xl">❌</span>}
                </div>
            )}
        </div>
    );
};

/**
 * SONUÇ EKRANI TASARIMI (Tasarım ve Metinler Güncellendi)
 */
interface ResultScreenProps {
    wasCorrect: boolean;
    onPlayAgain: () => void;
    onMainMenu: () => void;
    score: number;
    gameMode: GameMode;
}
const ResultScreen: React.FC<ResultScreenProps> = ({ wasCorrect, onPlayAgain, onMainMenu, score, gameMode }) => {

    // Sonuç ekranı sadece klasik modda "doğru" sonucu gösterebilir.
    // Diğer modlarda oyun bittiğinde 'wasCorrect' false olur (süre biter veya seri bozulur).
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

// ==================================================================
// --- ANA UYGULAMA (YENİ MOD İÇİN GÜNCELLENDİ) ---
// ==================================================================
const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('startScreen');
    const [gameMode, setGameMode] = useState<GameMode>('classic');
    const [score, setScore] = useState(0);
    const [lastResult, setLastResult] = useState(false);

    // YENİ EKLENDİ: Stilleri ve Tailwind'i yüklemek için useEffect
    useEffect(() => {
        // 1. Tailwind CSS'i Yükle
        const tailwindScriptId = 'tailwind-script';
        if (!document.getElementById(tailwindScriptId)) {
            const tailwindScript = document.createElement('script');
            tailwindScript.id = tailwindScriptId;
            tailwindScript.src = 'https://cdn.tailwindcss.com';
            document.head.appendChild(tailwindScript);
        }

        // 2. Google Font'u Yükle
        const fontLinkId = 'orbitron-font';
        if (!document.getElementById(fontLinkId)) {
            const fontLink = document.createElement('link');
            fontLink.id = fontLinkId;
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap';
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);
        }

        // 3. Özel Stilleri Ekle
        const styleId = 'custom-game-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                :root {
                    /* Yeni Renk Paleti (Neon / Koyu Tema) */
                    --color-oyun-arkaplan: #1A2035;       /* Koyu Lacivert */
                    --color-oyun-kart-dark: #2A3045;      /* Orta Koyu Lacivert */
                    --color-oyun-kart-dark-light: #3A4055;/* Açık Koyu Lacivert */
                    --color-oyun-text-light: #E0EFFF;    /* Çok Açık Mavi (Beyaz) */
                    --color-oyun-text-dark: #8A94B3;      /* Gri Mavi (Soluk) */
                    
                    --color-oyun-primary: #00F5D4;        /* Neon Cyan (Ana) */
                    --color-oyun-primary-light: #9CFEF0;  /* Açık Cyan */
                    --color-oyun-primary-dark: #00BFA9;   /* Koyu Cyan */
                    
                    --color-oyun-accent: #FF00A8;         /* Neon Pembe (Vurgu) */
                    
                    /* Takma adlar */
                    --color-oyun-yesil: var(--color-oyun-primary); /* Doğru = Cyan */
                    --color-oyun-kirmizi: var(--color-oyun-accent);  /* Yanlış = Pembe */
                }
                
                /* Yeni Yardımcı Sınıflar */
                .text-oyun-primary { color: var(--color-oyun-primary); }
                .bg-oyun-primary { background-color: var(--color-oyun-primary); }
                .border-oyun-primary { border-color: var(--color-oyun-primary); }
                .hover\\:bg-oyun-primary-dark:hover { background-color: var(--color-oyun-primary-dark); }
                .hover\\:border-oyun-primary-light:hover { border-color: var(--color-oyun-primary-light); }
                
                .text-oyun-accent { color: var(--color-oyun-accent); }
                .border-oyun-accent { border-color: var(--color-oyun-accent); }
                .hover\\:bg-oyun-accent:hover { background-color: var(--color-oyun-accent); }

                .bg-oyun-arkaplan { background-color: var(--color-oyun-arkaplan); }
                .text-oyun-arkaplan { color: var(--color-oyun-arkaplan); }
                .group-hover\\:text-oyun-arkaplan:hover .group:hover { color: var(--color-oyun-arkaplan); }

                .bg-oyun-kart-dark { background-color: var(--color-oyun-kart-dark); }
                .hover\\:bg-oyun-kart-dark-light:hover { background-color: var(--color-oyun-kart-dark-light); }
                
                .bg-oyun-kart-dark-light { background-color: var(--color-oyun-kart-dark-light); }
                .border-oyun-kart-dark-light { border-color: var(--color-oyun-kart-dark-light); }
                
                .text-oyun-text-light { color: var(--color-oyun-text-light); }
                .group-hover\\:text-oyun-text-light:hover .group:hover { color: var(--color-oyun-text-light); }

                .text-oyun-text-dark { color: var(--color-oyun-text-dark); }
                .group-hover\\:text-oyun-text-dark:hover .group:hover { color: var(--color-oyun-text-dark); }
                
                .text-oyun-kirmizi { color: var(--color-oyun-kirmizi); }
                .border-oyun-kirmizi { border-color: var(--color-oyun-kirmizi); }
                
                .text-oyun-yesil { color: var(--color-oyun-yesil); }
                .border-oyun-yesil { border-color: var(--color-oyun-yesil); }
                .hover\\:bg-oyun-yesil:hover { background-color: var(--color-oyun-yesil); }

                /* Yeni Font ve Efekt */
                .font-orbitron { font-family: 'Orbitron', sans-serif; }
                .drop-shadow-neon-primary { filter: drop-shadow(0 0 8px var(--color-oyun-primary)); }

                
                /* Animasyonlar (Değişmedi) */
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                
                @keyframes popIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-pop-in { animation: popIn 0.4s ease-out; }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                    20%, 40%, 60%, 80% { transform: translateX(10px); }
                }
                .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
            `;
            document.head.appendChild(style);
        }
    }, []); // Boş dependency array, sadece bir kez çalışır

    const handleStartGame = (mode: GameMode) => {
        setGameMode(mode);
        setScore(0);
        setGameState('playing');
    };

    // YENİ MOD ('streak') İÇİN GÜNCELLENDİ
    const handleGameEnd = (wasCorrect: boolean, finalScore?: number) => {
        setLastResult(wasCorrect);

        if (gameMode === 'timeAttack') {
            if (finalScore !== undefined) { // Süre doldu
                setScore(finalScore);
                setGameState('resultScreen');
            } else if (wasCorrect) { // Doğru bildi, skoru artır
                setScore(prev => prev + 1);
                // Oyun 'playing' durumunda kalır
            }
            // Yanlışsa (finalScore == undefined && !wasCorrect),
            // GameScreen zamanı düşürür, oyun 'playing' kalır

        } else if (gameMode === 'streak') {
            if (wasCorrect) { // Doğru bildi, skoru artır
                setScore(prev => prev + 1);
                // Oyun 'playing' durumunda kalır
            } else { // Yanlış bildi, oyun bitti
                setGameState('resultScreen');
            }

        } else { // 'classic' mod
            if (wasCorrect) {
                setScore(prev => prev + 1);
            }
            setGameState('resultScreen');
        }
    };

    // YENİ MOD ('streak') İÇİN GÜNCELLENDİ
    const handlePlayAgain = () => {
        if (gameMode === 'timeAttack' || gameMode === 'streak') {
            setScore(0); // Zaman ve Seri modlarında skor sıfırlanır
        }
        setGameState('playing');
    };

    const handleMainMenu = () => {
        setGameState('startScreen');
    };

    // ... (renderCurrentScreen değişmedi)
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

    // YENİ TASARIM İÇİN GÜNCELLENDİ
    return (
        <>
            {/* Stil ve fontlar artık useEffect ile yükleniyor */}

            {/* Ana Kapsayıcı (Tasarım Güncellendi) */}
            <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-oyun-arkaplan">
                {renderCurrentScreen()}
            </main>
        </>
    );
};


export default App;

