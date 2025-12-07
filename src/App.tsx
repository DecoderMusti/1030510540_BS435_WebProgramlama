import React, { useState, useEffect } from 'react';
import type { GameState, GameMode, ScoreEntry } from './types/game';
import StartScreen from './screens/StartScreen';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('startScreen');
    const [gameMode, setGameMode] = useState<GameMode>('classic');
    const [score, setScore] = useState(0);
    const [lastResult, setLastResult] = useState(false);

    // Oyuncu İsmi ve Skor Geçmişi
    const [playerName, setPlayerName] = useState('');
    const [history, setHistory] = useState<ScoreEntry[]>([]);

    // Uygulama açılınca LocalStorage'dan geçmişi yükle
    useEffect(() => {
        const savedHistory = localStorage.getItem('gameHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    const handleStartGame = (mode: GameMode) => {
        if (!playerName.trim()) setPlayerName('Misafir Dedektif'); // İsim boşsa default ata
        setGameMode(mode);
        setScore(0);
        setGameState('playing');
    };

    const saveScore = (finalScore: number) => {
        const newEntry: ScoreEntry = {
            name: playerName.trim() || 'Misafir',
            score: finalScore,
            mode: gameMode,
            date: new Date().toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };

        // Yeni skoru ekle, en başa koy, sadece son 10 taneyi tut
        const updatedHistory = [newEntry, ...history].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem('gameHistory', JSON.stringify(updatedHistory));
    };

    const handleGameEnd = (wasCorrect: boolean, finalScore?: number) => {
        setLastResult(wasCorrect);
        // HATA DÜZELTİLDİ: Gereksiz 'currentScore' değişkeni kaldırıldı.

        if (gameMode === 'timeAttack') {
            if (finalScore !== undefined) {
                setScore(finalScore);
                setGameState('resultScreen');
                saveScore(finalScore);
            } else if (wasCorrect) {
                setScore(prev => prev + 1);
            }
        } else if (gameMode === 'streak') {
            if (wasCorrect) {
                setScore(prev => prev + 1);
            } else {
                setGameState('resultScreen');
                saveScore(score);
            }
        } else { // classic
            if (wasCorrect) {
                setScore(prev => prev + 1);
            }

            setGameState('resultScreen');
            // Classic modda kazandıysa +1 puan ekleyerek kaydet (çünkü state güncellemesi asenkron olabilir)
            if (wasCorrect) saveScore(score + 1);
            else saveScore(score);
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
            return (
                <StartScreen
                    onStartGame={handleStartGame}
                    playerName={playerName}
                    setPlayerName={setPlayerName}
                    history={history}
                />
            );
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
        <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#0f172a] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] opacity-80 z-0" />
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-oyun-primary/20 rounded-full blur-[120px] z-0 animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-oyun-accent/15 rounded-full blur-[120px] z-0 animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="z-10 w-full flex justify-center">
                {renderCurrentScreen()}
            </div>
        </main>
    );
};

export default App;