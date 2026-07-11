import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GameContextType {
    players: string[];
    impostersCount: number;
    selectedCategoryId: number | null;
    secretWord: string | null;
    imposters: string[];
    currentRound: number;
    scores: Record<string, number>;
    categoryPool: number[]; // <--- سلة الفئات المتاحة

    setPlayers: (players: string[]) => void;
    setImpostersCount: (count: number) => void;
    setSelectedCategoryId: (id: number | null) => void;
    setSecretWord: (word: string | null) => void;
    setImposters: (imposters: string[]) => void;
    updateScore: (playerName: string, points: number) => void;
    setCategoryPool: (ids: number[]) => void; // <--- دالة تحديث السلة

    resetGame: () => void;
    nextRoundContext: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [players, setPlayers] = useState<string[]>([]);
    const [impostersCount, setImpostersCount] = useState<number>(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [secretWord, setSecretWord] = useState<string | null>(null);
    const [imposters, setImposters] = useState<string[]>([]);
    const [currentRound, setCurrentRound] = useState<number>(1);
    const [scores, setScores] = useState<Record<string, number>>({});
    const [categoryPool, setCategoryPool] = useState<number[]>([]);

    const updateScore = (playerName: string, points: number) => {
        setScores((prev) => ({
            ...prev,
            [playerName]: (prev[playerName] || 0) + points,
        }));
    };

    const resetGame = () => {
        setPlayers([]);
        setImpostersCount(1);
        setSelectedCategoryId(null);
        setSecretWord(null);
        setImposters([]);
        setCurrentRound(1);
        setScores({});
        setCategoryPool([]);
    };

    const nextRoundContext = () => {
        setSecretWord(null);
        setImposters([]);
        // مسح فئة الجولة السابقة لكي تختار شاشة التوزيع فئة جديدة من السلة
        setSelectedCategoryId(null);
        setCurrentRound((prev) => prev + 1);
    };

    return (
        <GameContext.Provider
            value={{
                players, impostersCount, selectedCategoryId, secretWord, imposters, currentRound, scores, categoryPool,
                setPlayers, setImpostersCount, setSelectedCategoryId, setSecretWord, setImposters, updateScore, setCategoryPool,
                resetGame, nextRoundContext,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within a GameProvider');
    return context;
};