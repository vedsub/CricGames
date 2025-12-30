import { useState, useEffect, useRef } from 'react';
import { getRandomQuestion, matchPlayerName } from '../data/tenaball';
import { bigCelebrate } from '../utils/confetti';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';

/**
 * Tenaball Layout:
 * - Centered panel, max-width 640px
 * - Vertical flow: Title → Lives/Found → Input+Button → List
 * - List is secondary (below the main interaction)
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
        inputRef.current?.focus();
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
            <PageContainer maxWidth="640px">
                <div className="py-16 text-center text-neutral-400">Loading...</div>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="640px">
            {/* Title */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Tenaball</h1>
                <p className="text-neutral-400">{question.question}</p>
            </div>

            {/* Status Card: Lives + Found */}
            <Card padding="sm" className="mb-6">
                <div className="flex items-center justify-between text-sm">
                    <div>
                        <span className="text-neutral-500">Lives: </span>
                        <span className="text-white font-medium">{lives}/3</span>
                    </div>
                    <div>
                        <span className="text-neutral-500">Found: </span>
                        <span className="text-green-400 font-medium">{revealed.length}/10</span>
                    </div>
                </div>
            </Card>

            {/* Message */}
            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm text-center ${message.type === 'success'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Input + Guess Button - Grouped */}
            {!gameOver && (
                <form onSubmit={handleGuess} className="mb-8">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder="Enter player name..."
                            className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-green-500"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={!guess.trim()}
                            className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:bg-neutral-700 disabled:text-neutral-500"
                        >
                            Guess
                        </button>
                    </div>
                </form>
            )}

            {/* Top 10 List - Secondary */}
            <div className="space-y-2">
                {question.answers.map((answer) => {
                    const isRevealed = revealed.includes(answer.rank);
                    return (
                        <div
                            key={answer.rank}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg ${isRevealed
                                ? 'bg-green-500/10 border border-green-500/20'
                                : 'bg-neutral-900 border border-neutral-800'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium ${isRevealed ? 'bg-green-500 text-white' : 'bg-neutral-800 text-neutral-500'
                                }`}>
                                {answer.rank}
                            </div>
                            <div className="flex-1">
                                {isRevealed ? (
                                    <div>
                                        <p className="font-medium text-white text-sm">{answer.name}</p>
                                        <p className="text-xs text-neutral-400">{answer.stat}</p>
                                    </div>
                                ) : (
                                    <div className="h-4 w-32 bg-neutral-800 rounded"></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Game Over */}
            {gameOver && (
                <Card className="mt-8 text-center">
                    <h2 className={`text-xl font-bold mb-2 ${hasWon ? 'text-green-400' : 'text-red-400'}`}>
                        {hasWon ? 'Perfect Score!' : 'Game Over'}
                    </h2>
                    <p className="text-sm text-neutral-400 mb-4">
                        You found {revealed.length}/10
                    </p>

                    {!hasWon && (
                        <div className="bg-neutral-800 rounded-lg p-4 mb-4 text-left">
                            <p className="text-xs text-neutral-500 mb-2">You missed:</p>
                            <div className="space-y-1">
                                {question.answers
                                    .filter(a => !revealed.includes(a.rank))
                                    .map(a => (
                                        <p key={a.rank} className="text-sm text-neutral-300">
                                            #{a.rank} {a.name}
                                        </p>
                                    ))
                                }
                            </div>
                        </div>
                    )}

                    <button
                        onClick={startNewGame}
                        className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
                    >
                        Play Again
                    </button>
                </Card>
            )}
        </PageContainer>
    );
}

export default Tenaball;
