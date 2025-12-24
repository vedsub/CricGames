import { useState, useEffect, useRef } from 'react';
import { getRandomMysteryPlayer, compareGuess, searchPlayers, whoAreYouPlayers } from '../data/whoareyou';
import { cricketCelebrate } from '../utils/confetti';

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

    // Initialize game
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

    // Handle search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const guessedIds = guesses.map(g => g.player.id);
        const results = searchPlayers(searchQuery, guessedIds);
        setSearchResults(results);
    }, [searchQuery, guesses]);

    // Handle guess
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

    // Attribute cell component
    const AttributeCell = ({ label, value, match, direction }) => (
        <div className={`flex flex-col items-center p-2 rounded-lg transition-all ${match ? 'bg-green-500/30 border border-green-500/50' : 'bg-[#1a1028] border border-[#3d2259]'
            }`}>
            <span className="text-xs text-gray-500 mb-1">{label}</span>
            <span className={`font-semibold text-sm ${match ? 'text-green-400' : 'text-white'}`}>
                {value}
                {direction && (
                    <span className="ml-1 text-yellow-400">
                        {direction === 'up' ? '↑' : '↓'}
                    </span>
                )}
            </span>
        </div>
    );

    if (!mysteryPlayer) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-[#39ff14] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-16 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                        Who Are You?
                    </h1>
                    <p className="text-gray-400 text-sm">Guess the mystery cricketer!</p>
                </div>

                {/* Photo Toggle & Attempts */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setShowPhoto(!showPhoto)}
                        className="px-4 py-2 rounded-lg bg-[#1a1028] border border-[#3d2259] text-sm text-gray-300 hover:border-[#39ff14]/50 transition-all"
                    >
                        {showPhoto ? '🙈 Hide Photo' : '👁️ Show Blurred Photo'}
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Attempts:</span>
                        <div className="flex gap-1">
                            {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full ${i < remainingAttempts ? 'bg-[#39ff14]' : 'bg-gray-700'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">({remainingAttempts} left)</span>
                    </div>
                </div>

                {/* Blurred Photo */}
                {showPhoto && (
                    <div className="mb-6 flex justify-center">
                        <div className={`w-32 h-32 rounded-2xl bg-[#251438] flex items-center justify-center text-6xl transition-all ${gameOver ? '' : 'blur-xl'
                            }`}>
                            {mysteryPlayer.image}
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                {!gameOver && (
                    <div className="relative mb-8">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type a player name to guess..."
                            className="w-full px-5 py-4 rounded-xl bg-[#1a1028] border-2 border-[#3d2259] text-white placeholder-gray-500 focus:outline-none focus:border-[#39ff14] text-lg"
                            autoComplete="off"
                        />

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1028] border border-[#3d2259] rounded-xl overflow-hidden z-50">
                                {searchResults.map(player => (
                                    <button
                                        key={player.id}
                                        onClick={() => handleGuess(player)}
                                        className="w-full p-4 text-left hover:bg-[#251438] transition-colors flex items-center gap-3"
                                    >
                                        <span className="text-2xl">{player.image}</span>
                                        <div>
                                            <p className="font-semibold text-white">{player.name}</p>
                                            <p className="text-xs text-gray-400">{player.team} • {player.role}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Attribute Headers */}
                {guesses.length > 0 && (
                    <div className="grid grid-cols-7 gap-2 mb-3 px-2">
                        <div className="text-xs text-gray-500 text-center">Player</div>
                        <div className="text-xs text-gray-500 text-center">Nation</div>
                        <div className="text-xs text-gray-500 text-center">League</div>
                        <div className="text-xs text-gray-500 text-center">Team</div>
                        <div className="text-xs text-gray-500 text-center">Role</div>
                        <div className="text-xs text-gray-500 text-center">Age</div>
                        <div className="text-xs text-gray-500 text-center">Jersey</div>
                    </div>
                )}

                {/* Guess History */}
                <div className="space-y-3 mb-8">
                    {guesses.map((guess, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-7 gap-2 p-2 rounded-xl ${guess.isCorrect ? 'bg-green-500/10 border-2 border-green-500' : 'bg-[#0a0612]'
                                }`}
                        >
                            {/* Player Name */}
                            <div className="flex items-center justify-center p-2 rounded-lg bg-[#251438]">
                                <span className="font-bold text-white text-xs text-center">{guess.player.name}</span>
                            </div>

                            <AttributeCell
                                label=""
                                value={guess.nationality.value.slice(0, 3).toUpperCase()}
                                match={guess.nationality.match}
                            />
                            <AttributeCell
                                label=""
                                value={guess.league.value}
                                match={guess.league.match}
                            />
                            <AttributeCell
                                label=""
                                value={guess.team.value}
                                match={guess.team.match}
                            />
                            <AttributeCell
                                label=""
                                value={guess.role.value.split('-')[0]}
                                match={guess.role.match}
                            />
                            <AttributeCell
                                label=""
                                value={guess.age.value}
                                match={guess.age.match}
                                direction={guess.age.direction}
                            />
                            <AttributeCell
                                label=""
                                value={`#${guess.jerseyNumber.value}`}
                                match={guess.jerseyNumber.match}
                                direction={guess.jerseyNumber.direction}
                            />
                        </div>
                    ))}
                </div>

                {/* Legend */}
                {guesses.length > 0 && !gameOver && (
                    <div className="flex items-center justify-center gap-6 text-xs text-gray-500 mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500/50"></div>
                            <span>Match</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400">↑</span>
                            <span>Higher</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400">↓</span>
                            <span>Lower</span>
                        </div>
                    </div>
                )}

                {/* Game Over Modal */}
                {gameOver && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
                        <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center">
                            {hasWon ? (
                                <>
                                    <span className="text-6xl mb-4 block">🏆</span>
                                    <h2 className="text-3xl font-bold text-[#39ff14] neon-text-glow mb-2">
                                        You Won!
                                    </h2>
                                    <p className="text-gray-400 mb-2">
                                        You guessed it in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!
                                    </p>
                                </>
                            ) : (
                                <>
                                    <span className="text-6xl mb-4 block">😢</span>
                                    <h2 className="text-3xl font-bold text-red-400 mb-2">
                                        Game Over
                                    </h2>
                                    <p className="text-gray-400 mb-2">
                                        The mystery player was:
                                    </p>
                                </>
                            )}

                            {/* Reveal Player */}
                            <div className="bg-[#1a1028] rounded-xl p-4 mb-6">
                                <p className="text-2xl font-bold text-[#39ff14]">{mysteryPlayer.name}</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {mysteryPlayer.team} • {mysteryPlayer.nationality} • #{mysteryPlayer.jerseyNumber}
                                </p>
                            </div>

                            <button
                                onClick={startNewGame}
                                className="px-8 py-4 rounded-xl bg-[#39ff14] text-[#0a0612] font-bold text-lg hover:bg-[#2ed610] transition-all neon-glow"
                            >
                                Play Again 🎮
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WhoAreYou;
