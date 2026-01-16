import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Search, RotateCcw, HelpCircle } from 'lucide-react';
import { getRandomMysteryPlayer, compareGuess, searchPlayers } from '../data/whoareyou';
import { cricketCelebrate } from '../utils/confetti';
import PageContainer from '../components/PageContainer';
import Card from '../components/ui/Card';

/**
 * WhoAreYou Layout:
 * - Centered Card (max-w-lg)
 * - Vertical Stack: Header -> Photo -> Input -> History
 * - Clean, focused UI
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
        setTimeout(() => inputRef.current?.focus(), 100);
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
        inputRef.current?.focus();

        if (result.isCorrect) {
            setHasWon(true);
            setGameOver(true);
            cricketCelebrate();
        } else if (guesses.length + 1 >= MAX_ATTEMPTS) {
            setGameOver(true);
        }
    };

    // Attribute Cell Component
    const AttributeCell = ({ value, match, direction }) => (
        <div className={`p-2 rounded text-xs font-medium text-center truncate flex items-center justify-center gap-1 ${match ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-surface border border-border text-gray-400'
            }`}>
            {value}
            {direction && <span className="text-yellow-400 font-bold">{direction === 'up' ? '↑' : '↓'}</span>}
        </div>
    );

    if (!mysteryPlayer) {
        return (
            <PageContainer className="flex items-center justify-center">
                <div className="text-gray-400 animate-pulse">Loading mystery player...</div>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="flex justify-center py-8">
            <div className="w-full max-w-lg space-y-6">

                {/* Game Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Who Are You?</h1>
                    <p className="text-gray-400 text-sm">Guess the cricket player from clues</p>
                </div>

                <Card className="overflow-visible bg-surface border-border p-6 space-y-6">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Attempts:</span>
                            <span className={`font-mono font-bold ${remainingAttempts < 3 ? 'text-red-400' : 'text-primary'}`}>
                                {remainingAttempts}/{MAX_ATTEMPTS}
                            </span>
                        </div>
                        <button
                            onClick={() => setShowPhoto(!showPhoto)}
                            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md bg-surface-hover hover:bg-white/10 text-gray-300 transition-colors border border-border"
                        >
                            {showPhoto ? <EyeOff size={14} /> : <Eye size={14} />}
                            {showPhoto ? 'Hide Photo' : 'Show Photo'}
                        </button>
                    </div>

                    {/* Photo Area */}
                    <div className="flex justify-center py-2">
                        <div className={`relative w-32 h-32 rounded-full overflow-hidden border-4 ${gameOver && hasWon ? 'border-primary' : 'border-surface-hover'
                            } shadow-xl transition-all duration-500 group`}>
                            <div className={`w-full h-full bg-neutral-800 flex items-center justify-center text-5xl transition-all duration-500 ${showPhoto || gameOver ? 'blur-0' : 'blur-xl opacity-50 scale-110'
                                }`}>
                                {mysteryPlayer.image}
                            </div>
                            {!showPhoto && !gameOver && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <HelpCircle className="w-10 h-10 text-gray-600 opacity-50" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input Area */}
                    {!gameOver ? (
                        <div className="relative space-y-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Type player name..."
                                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                    autoComplete="off"
                                />
                            </div>

                            {/* Dropdown Results */}
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-border">
                                    {searchResults.map(player => (
                                        <button
                                            key={player.id}
                                            onClick={() => handleGuess(player)}
                                            className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 group transition-colors"
                                        >
                                            <span className="text-xl w-8 text-center">{player.image}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-white text-sm group-hover:text-primary transition-colors truncate">{player.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{player.team} • {player.role}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center bg-background/50 rounded-lg p-6 border border-border">
                            <h2 className={`text-2xl font-bold mb-2 ${hasWon ? 'text-primary' : 'text-red-500'}`}>
                                {hasWon ? 'Correct!' : 'Game Over'}
                            </h2>
                            <div className="mb-6">
                                <p className="text-gray-400 text-sm">The mystery player was</p>
                                <p className="text-xl font-bold text-white mt-1">{mysteryPlayer.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{mysteryPlayer.team} • {mysteryPlayer.role}</p>
                            </div>
                            <button
                                onClick={startNewGame}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-black font-bold rounded-md hover:bg-primary-hover transition-colors"
                            >
                                <RotateCcw size={16} />
                                Play Again
                            </button>
                        </div>
                    )}
                </Card>

                {/* Guess History */}
                {guesses.length > 0 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-7 gap-2 px-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
                            <div className="col-span-1">Player</div>
                            <div>Nat</div>
                            <div>Lge</div>
                            <div>Team</div>
                            <div>Role</div>
                            <div>Age</div>
                            <div>#</div>
                        </div>

                        <div className="space-y-2">
                            {/* Reversed to show latest guess first or top? Requirement didn't specify. Standard is top to bottom. */}
                            {[...guesses].reverse().map((guess, index) => (
                                <div key={index} className="grid grid-cols-7 gap-2 animate-fade-in">
                                    <div className={`p-2 rounded text-xs font-bold text-center truncate flex items-center justify-center ${guess.isCorrect ? 'bg-green-500 text-black' : 'bg-surface-hover text-white'
                                        }`}>
                                        {guess.player.name}
                                    </div>
                                    <AttributeCell value={guess.nationality.value.slice(0, 3).toUpperCase()} match={guess.nationality.match} />
                                    <AttributeCell value={guess.league.value} match={guess.league.match} />
                                    <AttributeCell value={guess.team.value} match={guess.team.match} />
                                    <AttributeCell value={guess.role.value.split('-')[0]} match={guess.role.match} />
                                    <AttributeCell value={guess.age.value} match={guess.age.match} direction={guess.age.direction} />
                                    <AttributeCell value={guess.jerseyNumber.value} match={guess.jerseyNumber.match} direction={guess.jerseyNumber.direction} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PageContainer>
    );
}

export default WhoAreYou;
