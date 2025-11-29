import React, { useState } from 'react';
import type { GameState, GameMode } from './types/game';
import StartScreen from './screens/StartScreen';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';

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
            if (finalScore !== undefined) {
                setScore(finalScore);
                setGameState('resultScreen');
            } else if (wasCorrect) {
                setScore(prev => prev + 1);
            }
        } else if (gameMode === 'streak') {
            if (wasCorrect) {
                setScore(prev => prev + 1);
            } else {
                setGameState('resultScreen');
            }
        } else { // classic
            if (wasCorrect) {
                setScore(prev => prev + 1);
            }
            setGameState('resultScreen');
        }
    };

    const handlePlayAgain = () => {
        if (gameMode === 'timeAttack' || gameMode === 'streak') {
            setScore(0);
        }
        setGameState('playing');
    };

    const handleMainMenu = () => {
        setGameState('startScreen');
    };

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
        return <div className="text-white animate-pulse">Yükleniyor...</div>;
    };

    return (
        // GÜNCELLENMİŞ ARKA PLAN YAPISI
        // Dış kaynak kullanılmadan, CSS Gradient ve Blur efektleri ile modern görünüm
        <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#0f172a] relative overflow-hidden">

            {/* 1. Katman: Ana Gradient (Koyu Lacivert - Siyah Geçişi) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] opacity-80 z-0" />

            {/* 2. Katman: Dekoratif Işıklar (Blur Efektli) */}
            {/* Sol üst köşe: Cyan Işık */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-oyun-primary/20 rounded-full blur-[120px] z-0 animate-pulse" />

            {/* Sağ alt köşe: Pembe Işık */}
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-oyun-accent/15 rounded-full blur-[120px] z-0 animate-pulse" style={{ animationDuration: '4s' }} />

            {/* İçerik Alanı (Z-Index ile öne alındı, böylece arka planın üstünde kalır) */}
            <div className="z-10 w-full flex justify-center">
                {renderCurrentScreen()}
            </div>
        </main>
    );
};

export default App;