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

    const handlePlayAgain = () => {
        if (gameMode === 'timeAttack' || gameMode === 'streak') {
            setScore(0); // Zaman ve Seri modlarında skor sıfırlanır
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
        return <div>Yükleniyor...</div>;
    };

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-oyun-arkaplan">
            {renderCurrentScreen()}
        </main>
    );
};

export default App;