import { useState, useEffect, useRef } from 'react';
import { Heart, Trophy, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { getRandomQuestion, matchPlayerName } from '../data/tenaball';
import { bigCelebrate } from '../utils/confetti';
import PageContainer from '../components/PageContainer';
import Card from '../components/ui/Card';

/**
 * Tenaball Layout:
 * - Centered Card (max-w-xl)
 * - Header: Title + Question
 * - Stats Row: Lives + Found
 * - Input Row: Input + Button
 * - List: Ordered 1-10
 */
function Tenaball() {
    const [question, setQuestion] = useState(null);
    const [revealed, setRevealed] = useState([]);
    const [lives, setLives] = useState(3);
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [guessedNames, setGuessedNames] = useState([]);
    const inputRef = useRef(null);

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
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    useEffect(() => {
        if (question && revealed.length === 10) {
            setHasWon(true);
            setGameOver(true);
            bigCelebrate();
        }
    }, [revealed, question]);

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
            if (revealed.includes(match.rank)) {
                setMessage({ type: 'error', text: `${match.name} already revealed!` });
                setLives(prev => prev - 1);
            } else {
                setRevealed(prev => [...prev, match.rank]);
                setMessage({ type: 'success', text: `Correct! #${match.rank}` });
                setGuessedNames(prev => [...prev, match.name.toLowerCase()]);
            }
        } else {
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
            <PageContainer className="flex items-center justify-center">
                <div className="text-gray-400 animate-pulse">Loading game...</div>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="flex justify-center py-8">
            <div className="w-full max-w-xl space-y-4">

                {/* Mode Header */}
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Tenaball</h1>
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Top 10 Challenge</p>
                </div>

                <Card className="overflow-hidden bg-surface border-border">
                    {/* Question Header */}
                    <div className="p-6 border-b border-border bg-background/50">
                        <h2 className="text-xl font-bold text-white leading-tight">
                            {question.question}
                        </h2>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center justify-between px-6 py-4 bg-surface-hover/50 border-b border-border">
                        <div className="flex items-center gap-2">
                            <Heart className={`w-5 h-5 ${lives < 2 ? 'text-red-500 animate-pulse' : 'text-primary'}`} fill={lives > 0 ? "currentColor" : "none"} />
                            <span className="font-mono font-bold text-white text-lg">{lives}</span>
                            <span className="text-xs text-gray-500 uppercase font-semibold ml-1">Lives</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            <span className="font-mono font-bold text-white text-lg">{revealed.length}/10</span>
                            <span className="text-xs text-gray-500 uppercase font-semibold ml-1">Found</span>
                        </div>
                    </div>

                    {/* Feedback Message */}
                    {message && (
                        <div className={`px-6 py-2 text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            {message.text}
                        </div>
                    )}

                    {/* Input Area */}
                    {!gameOver ? (
                        <div className="p-6 bg-surface">
                            <form onSubmit={handleGuess} className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={guess}
                                    onChange={(e) => setGuess(e.target.value)}
                                    placeholder="Enter player name..."
                                    className="flex-1 bg-background border border-border rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                                    autoComplete="off"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!guess.trim()}
                                    className="px-6 py-3 bg-primary text-black font-bold rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Guess
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="p-6 bg-surface text-center">
                            <h3 className={`text-2xl font-bold mb-2 ${hasWon ? 'text-primary' : 'text-red-500'}`}>
                                {hasWon ? 'Perfect Score!' : 'Game Over'}
                            </h3>
                            <button
                                onClick={startNewGame}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <RefreshCw size={16} />
                                Play Again
                            </button>
                        </div>
                    )}

                    {/* Results List */}
                    <div className="border-t border-border divide-y divide-border/50">
                        {question.answers.map((answer) => {
                            const isRevealed = revealed.includes(answer.rank);
                            const isMissed = gameOver && !hasWon && !isRevealed;

                            return (
                                <div
                                    key={answer.rank}
                                    className={`flex items-center px-6 py-3 transition-colors ${isRevealed ? 'bg-primary/5' : isMissed ? 'bg-red-500/5' : 'bg-transparent'
                                        }`}
                                >
                                    <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded font-mono font-bold text-sm mr-4 ${isRevealed ? 'bg-primary text-black' : isMissed ? 'bg-red-500/20 text-red-400' : 'bg-background border border-border text-gray-500'
                                        }`}>
                                        {answer.rank}
                                    </div>

                                    <div className="flex-1">
                                        {isRevealed || isMissed ? (
                                            <div className="flex justify-between items-center">
                                                <span className={`font-bold ${isRevealed ? 'text-white' : 'text-gray-400'}`}>
                                                    {answer.name}
                                                </span>
                                                <span className="text-xs text-gray-500 font-mono">
                                                    {answer.stat}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="h-2 w-24 bg-border/50 rounded-full" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
}

export default Tenaball;
