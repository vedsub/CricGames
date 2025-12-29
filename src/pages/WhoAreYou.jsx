import { useState, useEffect, useRef } from 'react';
import { getRandomMysteryPlayer, compareGuess, searchPlayers } from '../data/whoareyou';
import { cricketCelebrate } from '../utils/confetti';
import Container from '../components/ui/Container';

/**
 * WhoAreYou Layout:
 * - Centered panel, max-width 700px
 * - Vertical flow: Title → Controls Card (attempts, photo toggle, input) → Guess History
 * - No floating elements or empty black space
 */
function WhoAreYou() {
    const [mysteryPlayer, setMysteryPlayer] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showPhoto, setShowPhoto] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const inputRef = useRef(null);

    const MAX_ATTEMPTS = 8;
    const remainingAttempts = MAX_ATTEMPTS - guesses.length;

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        setMysteryPlayer(getRandomMysteryPlayer());
        setGuesses([]);
        setSearchQuery('');
        setSearchResults([]);
        setShowPhoto(false);
        setGameOver(false);
        setHasWon(false);
        inputRef.current?.focus();
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const guessedIds = guesses.map(g => g.player.id);
        const results = searchPlayers(searchQuery, guessedIds);
        setSearchResults(results);
    }, [searchQuery, guesses]);

    const handleGuess = (player) => {
        if (gameOver || !mysteryPlayer) return;

        const result = compareGuess(player, mysteryPlayer);
        setGuesses(prev => [...prev, result]);
        setSearchQuery('');
        setSearchResults([]);

        if (result.isCorrect) {
            setHasWon(true);
            setGameOver(true);
            cricketCelebrate();
        } else if (guesses.length + 1 >= MAX_ATTEMPTS) {
            setGameOver(true);
        }
    };

    const AttributeCell = ({ value, match, direction }) => (
        <div className={`px-2 py-1.5 rounded text-xs text-center ${match ? 'bg-green-500/20 text-green-400' : 'bg-neutral-800 text-neutral-300'
            }`}>
            {value}
            {direction && <span className="ml-1 text-yellow-400">{direction === 'up' ? '↑' : '↓'}</span>}
        </div>
    );

    if (!mysteryPlayer) {
        return (
            <Container>
                <div className="py-16 text-center text-neutral-400">Loading...</div>
            </Container>
        );
    }

    return (
        <Container>
            {/* Centered Panel - max 700px */}
            <div className="max-w-[700px] mx-auto py-8">

                {/* Title */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">Who Are You?</h1>
                    <p className="text-neutral-400">Guess the mystery cricketer</p>
                </div>

                {/* Controls Card - Grouped: attempts, photo toggle, input */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
                    {/* Attempts + Photo Toggle */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm">
                            <span className="text-neutral-500">Attempts: </span>
                            <span className="text-white font-medium">{remainingAttempts}/{MAX_ATTEMPTS}</span>
                        </div>
                        <button
                            onClick={() => setShowPhoto(!showPhoto)}
                            className="px-3 py-1.5 text-sm bg-neutral-800 border border-neutral-700 rounded text-neutral-300 hover:bg-neutral-700"
                        >
                            {showPhoto ? 'Hide Photo' : 'Show Photo'}
                        </button>
                    </div>

                    {/* Blurred Photo */}
                    {showPhoto && (
                        <div className="mb-4 flex justify-center">
                            <div className={`w-20 h-20 rounded-lg bg-neutral-800 flex items-center justify-center text-3xl ${gameOver ? '' : 'blur-lg'
                                }`}>
                                {mysteryPlayer.image}
                            </div>
                        </div>
                    )}

                    {/* Search Input */}
                    {!gameOver && (
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Type a player name..."
                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-green-500"
                                autoComplete="off"
                            />

                            {/* Search Results Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden z-50 max-h-48 overflow-y-auto">
                                    {searchResults.map(player => (
                                        <button
                                            key={player.id}
                                            onClick={() => handleGuess(player)}
                                            className="w-full p-3 text-left hover:bg-neutral-800 flex items-center gap-3 border-b border-neutral-800 last:border-b-0"
                                        >
                                            <span className="text-lg">{player.image}</span>
                                            <div>
                                                <p className="font-medium text-white text-sm">{player.name}</p>
                                                <p className="text-xs text-neutral-500">{player.team} • {player.role}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Guess History */}
                {guesses.length > 0 && (
                    <div className="mb-6">
                        {/* Headers */}
                        <div className="overflow-x-auto">
                            <div className="min-w-[600px]">
                                <div className="grid grid-cols-7 gap-2 mb-2 text-xs text-neutral-500 px-2">
                                    <div className="text-center">Player</div>
                                    <div className="text-center">Nation</div>
                                    <div className="text-center">League</div>
                                    <div className="text-center">Team</div>
                                    <div className="text-center">Role</div>
                                    <div className="text-center">Age</div>
                                    <div className="text-center">Jersey</div>
                                </div>

                                {/* Rows */}
                                <div className="space-y-2">
                                    {guesses.map((guess, index) => (
                                        <div
                                            key={index}
                                            className={`grid grid-cols-7 gap-2 p-2 rounded-lg ${guess.isCorrect
                                                    ? 'bg-green-500/10 border border-green-500/20'
                                                    : 'bg-neutral-900 border border-neutral-800'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center px-2 py-1.5 rounded bg-neutral-800">
                                                <span className="text-xs font-medium text-white truncate">{guess.player.name}</span>
                                            </div>
                                            <AttributeCell value={guess.nationality.value.slice(0, 3).toUpperCase()} match={guess.nationality.match} />
                                            <AttributeCell value={guess.league.value} match={guess.league.match} />
                                            <AttributeCell value={guess.team.value} match={guess.team.match} />
                                            <AttributeCell value={guess.role.value.split('-')[0]} match={guess.role.match} />
                                            <AttributeCell value={guess.age.value} match={guess.age.match} direction={guess.age.direction} />
                                            <AttributeCell value={`#${guess.jerseyNumber.value}`} match={guess.jerseyNumber.match} direction={guess.jerseyNumber.direction} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        {!gameOver && (
                            <div className="flex items-center justify-center gap-6 text-xs text-neutral-500 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-green-500/20"></div>
                                    <span>Match</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">↑↓</span>
                                    <span>Higher/Lower</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Game Over Modal */}
                {gameOver && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-sm w-full text-center">
                            <h2 className={`text-xl font-bold mb-2 ${hasWon ? 'text-green-400' : 'text-red-400'}`}>
                                {hasWon ? 'You Won!' : 'Game Over'}
                            </h2>
                            <p className="text-sm text-neutral-400 mb-4">
                                {hasWon ? `Guessed in ${guesses.length} tries` : 'The answer was:'}
                            </p>

                            <div className="bg-neutral-800 rounded-lg p-4 mb-6">
                                <p className="text-lg font-bold text-green-400">{mysteryPlayer.name}</p>
                                <p className="text-xs text-neutral-400 mt-1">
                                    {mysteryPlayer.team} • {mysteryPlayer.nationality}
                                </p>
                            </div>

                            <button
                                onClick={startNewGame}
                                className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}

export default WhoAreYou;
