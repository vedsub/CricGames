import { useState, useEffect, useRef } from 'react';
import { getRandomQuestion, matchPlayerName } from '../data/tenaball';
import { bigCelebrate } from '../utils/confetti';

function Tenaball() {
    const [question, setQuestion] = useState(null);
    const [revealed, setRevealed] = useState([]); // Array of revealed rank numbers
    const [lives, setLives] = useState(3);
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [guessedNames, setGuessedNames] = useState([]);
    const inputRef = useRef(null);

    // Initialize game
    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const q = getRandomQuestion();
        setQuestion(q);
        setRevealed([]);
        setLives(3);
        setGuess('');
        setMessage(null);
        setGameOver(false);
        setHasWon(false);
        setGuessedNames([]);
        inputRef.current?.focus();
    };

    // Check for win
    useEffect(() => {
        if (question && revealed.length === 10) {
            setHasWon(true);
            setGameOver(true);
            bigCelebrate();
        }
    }, [revealed, question]);

    // Check for loss
    useEffect(() => {
        if (lives === 0) {
            setGameOver(true);
        }
    }, [lives]);

    const handleGuess = (e) => {
        e.preventDefault();
        if (!guess.trim() || gameOver) return;

        const match = matchPlayerName(guess, question.answers);

        if (match) {
            // Check if already revealed
            if (revealed.includes(match.rank)) {
                setMessage({ type: 'error', text: `${match.name} already revealed!` });
                setLives(prev => prev - 1);
            } else {
                // Correct guess!
                setRevealed(prev => [...prev, match.rank]);
                setMessage({ type: 'success', text: `Correct! ${match.name} is #${match.rank}` });
                setGuessedNames(prev => [...prev, match.name.toLowerCase()]);
            }
        } else {
            // Check if this exact name was already guessed wrong
            if (guessedNames.includes(guess.toLowerCase().trim())) {
                setMessage({ type: 'error', text: 'Already guessed that!' });
            } else {
                setMessage({ type: 'error', text: 'Wrong guess!' });
                setGuessedNames(prev => [...prev, guess.toLowerCase().trim()]);
            }
            setLives(prev => prev - 1);
        }

        setGuess('');
        setTimeout(() => setMessage(null), 2000);
    };

    if (!question) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-[#39ff14] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-16 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                        Tenaball
                    </h1>
                    <p className="text-gray-400 text-sm">Guess the Top 10!</p>
                </div>

                {/* Question */}
                <div className="glass-card rounded-2xl p-6 mb-6 text-center">
                    <p className="text-xl md:text-2xl font-bold text-white">
                        {question.question}
                    </p>
                </div>

                {/* Lives & Progress */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Lives:</span>
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`text-2xl transition-all ${i < lives ? 'text-red-500' : 'text-gray-700 opacity-50'}`}
                                >
                                    ❤️
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">
                        <span className="text-[#39ff14] font-bold">{revealed.length}</span>/10 found
                    </div>
                </div>

                {/* Message Toast */}
                {message && (
                    <div className={`mb-4 p-3 rounded-xl text-center font-semibold ${message.type === 'success'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Guess Input */}
                {!gameOver && (
                    <form onSubmit={handleGuess} className="mb-8">
                        <div className="flex gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                                placeholder="Enter player name..."
                                className="flex-1 px-5 py-4 rounded-xl bg-[#1a1028] border-2 border-[#3d2259] text-white placeholder-gray-500 focus:outline-none focus:border-[#39ff14] text-lg"
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                disabled={!guess.trim()}
                                className="px-6 py-4 rounded-xl bg-[#39ff14] text-[#0a0612] font-bold hover:bg-[#2ed610] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Guess
                            </button>
                        </div>
                    </form>
                )}

                {/* Top 10 Slots */}
                <div className="space-y-3">
                    {question.answers.map((answer) => {
                        const isRevealed = revealed.includes(answer.rank);
                        return (
                            <div
                                key={answer.rank}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${isRevealed
                                    ? 'bg-[#39ff14]/10 border-2 border-[#39ff14]/50'
                                    : 'bg-[#1a1028] border-2 border-[#3d2259]'
                                    }`}
                            >
                                {/* Rank */}
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${isRevealed
                                    ? 'bg-[#39ff14] text-[#0a0612]'
                                    : 'bg-[#251438] text-gray-400'
                                    }`}>
                                    {answer.rank}
                                </div>

                                {/* Name */}
                                <div className="flex-1">
                                    {isRevealed ? (
                                        <div>
                                            <p className="font-bold text-white text-lg">{answer.name}</p>
                                            <p className="text-sm text-[#39ff14]">{answer.stat}</p>
                                        </div>
                                    ) : (
                                        <div className="h-6 w-48 bg-[#251438] rounded animate-pulse"></div>
                                    )}
                                </div>

                                {/* Revealed indicator */}
                                {isRevealed && (
                                    <span className="text-[#39ff14] text-xl">✓</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Game Over / Win Screen */}
                {gameOver && (
                    <div className="mt-8 glass-card rounded-2xl p-8 text-center">
                        {hasWon ? (
                            <>
                                <span className="text-6xl mb-4 block">🏆</span>
                                <h2 className="text-3xl font-bold text-[#39ff14] neon-text-glow mb-2">
                                    Perfect Score!
                                </h2>
                                <p className="text-gray-400 mb-6">You guessed all 10 correctly!</p>
                            </>
                        ) : (
                            <>
                                <span className="text-6xl mb-4 block">💔</span>
                                <h2 className="text-3xl font-bold text-red-400 mb-2">
                                    Game Over
                                </h2>
                                <p className="text-gray-400 mb-4">You found {revealed.length}/10</p>

                                {/* Show remaining answers */}
                                <div className="text-left bg-[#1a1028] rounded-xl p-4 mb-6">
                                    <p className="text-sm text-gray-500 mb-2">You missed:</p>
                                    <div className="space-y-1">
                                        {question.answers
                                            .filter(a => !revealed.includes(a.rank))
                                            .map(a => (
                                                <p key={a.rank} className="text-gray-300">
                                                    <span className="text-[#39ff14]">#{a.rank}</span> {a.name}
                                                </p>
                                            ))
                                        }
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            onClick={startNewGame}
                            className="px-8 py-4 rounded-xl bg-[#39ff14] text-[#0a0612] font-bold text-lg hover:bg-[#2ed610] transition-all neon-glow"
                        >
                            Play Again 🎮
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tenaball;
