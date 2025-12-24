import { useState, useEffect } from 'react';
import { players, availableTags, validateGrid } from '../data/players';
import SearchModal from '../components/SearchModal';
import TagSelector, { TAG_LABELS } from '../components/TagSelector';
import RoomLobby from '../components/RoomLobby';
import WaitingRoom from '../components/WaitingRoom';
import { celebrate } from '../utils/confetti';
import {
    createRoom,
    joinRoom,
    subscribeToRoom,
    updateGrid,
    startGame,
    leaveRoom,
    getPlayerId
} from '../config/firebase';

function BoxCricket() {
    // Multiplayer state
    const [gameMode, setGameMode] = useState('lobby'); // lobby, waiting, selecting, playing
    const [roomCode, setRoomCode] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSolo, setIsSolo] = useState(false);

    // Game state
    const [rowTags, setRowTags] = useState([]);
    const [colTags, setColTags] = useState([]);
    const [grid, setGrid] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));
    const [selectedCell, setSelectedCell] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [usedPlayers, setUsedPlayers] = useState([]);

    const playerId = getPlayerId();
    const isMyTurn = isSolo || (roomData && ((isHost && roomData.turn === 'host') || (!isHost && roomData.turn === 'guest')));

    // Subscribe to room updates
    useEffect(() => {
        if (!roomCode || isSolo) return;

        const unsubscribe = subscribeToRoom(roomCode, (data) => {
            setRoomData(data);

            // Sync grid from Firebase
            if (data.grid) {
                setGrid(data.grid);
            }

            // Sync tags
            if (data.rowTags?.length > 0) {
                setRowTags(data.rowTags);
            }
            if (data.colTags?.length > 0) {
                setColTags(data.colTags);
            }

            // Update game mode based on status
            if (data.status === 'waiting' && isHost) {
                setGameMode('waiting');
            } else if (data.status === 'selecting') {
                setGameMode('selecting');
            } else if (data.status === 'playing') {
                setGameMode('playing');
            }

            // Track used players from grid
            const used = data.grid?.flat().filter(Boolean).map(p => p.id) || [];
            setUsedPlayers(used);
        });

        return () => unsubscribe();
    }, [roomCode, isHost, isSolo]);

    // Handle creating a room
    const handleCreateRoom = async (solo = false) => {
        if (solo) {
            setIsSolo(true);
            setGameMode('selecting');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const result = await createRoom();
            setRoomCode(result.roomCode);
            setIsHost(true);
            setGameMode('waiting');
        } catch (err) {
            setError(err.message || 'Failed to create room');
        }
        setIsLoading(false);
    };

    // Handle joining a room
    const handleJoinRoom = async (code) => {
        setIsLoading(true);
        setError('');
        try {
            const result = await joinRoom(code);
            setRoomCode(code);
            setIsHost(result.isHost);
            setGameMode('selecting');
        } catch (err) {
            setError(err.message || 'Failed to join room');
        }
        setIsLoading(false);
    };

    // Handle leaving room
    const handleLeaveRoom = async () => {
        if (roomCode && !isSolo) {
            await leaveRoom(roomCode, isHost);
        }
        setRoomCode(null);
        setRoomData(null);
        setIsHost(false);
        setGameMode('lobby');
        setRowTags([]);
        setColTags([]);
        setGrid(Array(3).fill(null).map(() => Array(3).fill(null)));
        setUsedPlayers([]);
        setIsSolo(false);
    };

    // Handle starting game with selected tags
    const handleStartGame = async (rows, cols) => {
        const validation = validateGrid(rows, cols);
        if (!validation.valid) {
            setMessage({
                type: 'error',
                text: `No player matches ${TAG_LABELS[validation.missing.row]} + ${TAG_LABELS[validation.missing.col]}`
            });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        setRowTags(rows);
        setColTags(cols);
        setGrid(Array(3).fill(null).map(() => Array(3).fill(null)));
        setUsedPlayers([]);

        if (!isSolo && roomCode) {
            await startGame(roomCode, rows, cols);
        }

        setGameMode('playing');
    };

    // Handle cell click
    const handleCellClick = (rowIndex, colIndex) => {
        if (grid[rowIndex][colIndex]) return;
        if (!isSolo && !isMyTurn) {
            setMessage({ type: 'error', text: "Wait for your turn!" });
            setTimeout(() => setMessage(null), 2000);
            return;
        }
        setSelectedCell({ row: rowIndex, col: colIndex });
        setIsModalOpen(true);
        setMessage(null);
    };

    // Handle player selection
    const handleSelectPlayer = async (player) => {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const rowTag = rowTags[row];
        const colTag = colTags[col];

        if (usedPlayers.includes(player.id)) {
            setMessage({ type: 'error', text: `${player.name} is already used!` });
            setTimeout(() => setMessage(null), 2000);
            return;
        }

        const matchesRow = player.tags.includes(rowTag);
        const matchesCol = player.tags.includes(colTag);

        if (matchesRow && matchesCol) {
            const newGrid = grid.map(r => [...r]);
            newGrid[row][col] = player;
            setGrid(newGrid);
            setUsedPlayers([...usedPlayers, player.id]);
            setMessage({ type: 'success', text: 'Correct! ✓' });
            setIsModalOpen(false);

            // Update Firebase
            if (!isSolo && roomCode) {
                const nextTurn = isHost ? 'guest' : 'host';
                await updateGrid(roomCode, newGrid, nextTurn);
            }

            setTimeout(() => setMessage(null), 2000);
        } else {
            const missing = !matchesRow ? TAG_LABELS[rowTag] : TAG_LABELS[colTag];
            setMessage({ type: 'error', text: `Wrong! ${player.name} doesn't match ${missing}` });

            // On wrong answer, switch turn in multiplayer
            if (!isSolo && roomCode) {
                const nextTurn = isHost ? 'guest' : 'host';
                await updateGrid(roomCode, grid, nextTurn);
            }

            setTimeout(() => setMessage(null), 3000);
        }
    };

    // Calculate scores
    const filledCount = grid.flat().filter(Boolean).length;
    const isComplete = filledCount === 9;

    // Celebrate on completion
    useEffect(() => {
        if (isComplete) {
            celebrate();
        }
    }, [isComplete]);

    // Render based on game mode
    if (gameMode === 'lobby') {
        return (
            <RoomLobby
                onCreateRoom={handleCreateRoom}
                onJoinRoom={handleJoinRoom}
                isLoading={isLoading}
                error={error}
            />
        );
    }

    if (gameMode === 'waiting') {
        return (
            <WaitingRoom
                roomCode={roomCode}
                onLeave={handleLeaveRoom}
                isHost={isHost}
            />
        );
    }

    if (gameMode === 'selecting') {
        return (
            <>
                {/* Show who's selecting */}
                {!isSolo && (
                    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl glass-card">
                        <span className="text-gray-400">Room: </span>
                        <span className="text-[#39ff14] font-mono font-bold">{roomCode}</span>
                        {!isHost && <span className="text-gray-400 ml-4">Waiting for host to select categories...</span>}
                    </div>
                )}

                {/* Only host can select categories */}
                {(isSolo || isHost) ? (
                    <TagSelector availableTags={availableTags} onStartGame={handleStartGame} />
                ) : (
                    <div className="min-h-screen pt-32 pb-16 px-6 flex flex-col items-center justify-center">
                        <div className="text-center glass-card rounded-3xl p-12">
                            <div className="relative mb-8">
                                <div className="w-20 h-20 border-4 border-[#3d2259] rounded-full mx-auto"></div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 border-4 border-[#39ff14] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Waiting for Host</h2>
                            <p className="text-gray-400">The host is selecting the categories...</p>
                        </div>
                    </div>
                )}

                {message && (
                    <div className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-semibold z-50 ${message.type === 'success'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                        {message.text}
                    </div>
                )}
            </>
        );
    }

    // Playing mode
    return (
        <div className="min-h-screen pt-32 pb-16 px-6 flex flex-col items-center">
            <div className="w-full max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Box Cricket
                    </h1>

                    {/* Multiplayer info */}
                    {!isSolo && (
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <span className="text-gray-400">Room: </span>
                            <span className="text-[#39ff14] font-mono font-bold">{roomCode}</span>
                        </div>
                    )}

                    {/* Turn indicator */}
                    <div className="flex items-center justify-center gap-4 mb-2">
                        {!isSolo && (
                            <div className={`px-4 py-2 rounded-xl ${isMyTurn
                                ? 'bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/50'
                                : 'bg-gray-700/50 text-gray-400 border border-gray-600'
                                }`}>
                                {isMyTurn ? "🎯 Your Turn" : "⏳ Opponent's Turn"}
                            </div>
                        )}
                        <span className="text-sm text-gray-500">{filledCount}/9 completed</span>
                    </div>

                    <button
                        onClick={handleLeaveRoom}
                        className="text-sm text-gray-500 hover:text-red-400"
                    >
                        ← Leave Game
                    </button>
                </div>

                {/* Message Toast */}
                {message && (
                    <div className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-semibold z-50 ${message.type === 'success'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Grid Container */}
                <div className="overflow-x-auto">
                    <div className="min-w-[500px]">
                        {/* Top Headers */}
                        <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: '140px repeat(3, 1fr)' }}>
                            <div></div>
                            {colTags.map((tag) => (
                                <div
                                    key={tag}
                                    className="flex items-center justify-center p-3 rounded-xl bg-[#251438] text-center min-h-[60px]"
                                >
                                    <span className="font-semibold text-[#39ff14] text-xs">
                                        {TAG_LABELS[tag] || tag}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Grid Rows */}
                        {rowTags.map((rowTag, rowIndex) => (
                            <div key={rowTag} className="grid gap-2 mb-2" style={{ gridTemplateColumns: '140px repeat(3, 1fr)' }}>
                                <div className="flex items-center justify-center p-3 rounded-xl bg-[#251438]">
                                    <span className="font-semibold text-[#39ff14] text-xs text-center">
                                        {TAG_LABELS[rowTag] || rowTag}
                                    </span>
                                </div>

                                {colTags.map((colTag, colIndex) => {
                                    const cell = grid[rowIndex][colIndex];
                                    const canClick = !cell && (isSolo || isMyTurn);

                                    return (
                                        <button
                                            key={`${rowIndex}-${colIndex}`}
                                            onClick={() => handleCellClick(rowIndex, colIndex)}
                                            disabled={!canClick}
                                            className={`aspect-square rounded-xl border-2 transition-all duration-300 flex items-center justify-center overflow-hidden ${cell
                                                ? 'border-[#39ff14]/50 bg-[#1a1028]'
                                                : canClick
                                                    ? 'border-[#3d2259] bg-[#1a1028] hover:border-[#39ff14] hover:bg-[#251438] cursor-pointer'
                                                    : 'border-[#3d2259] bg-[#1a1028] opacity-50 cursor-not-allowed'
                                                }`}
                                        >
                                            {cell ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                                                    <div className="w-14 h-14 rounded-full bg-[#251438] flex items-center justify-center mb-1 text-2xl">
                                                        🏏
                                                    </div>
                                                    <span className="text-xs text-white font-medium text-center truncate w-full px-1">
                                                        {cell.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-3xl text-gray-600">?</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Complete Message */}
                {isComplete && (
                    <div className="mt-8 text-center p-6 glass-card rounded-xl">
                        <span className="text-4xl mb-4 block">🎉</span>
                        <h2 className="text-2xl font-bold text-[#39ff14] neon-text-glow">
                            Game Complete!
                        </h2>
                        <p className="text-gray-400 mt-2">All cells have been filled.</p>
                        <button
                            onClick={handleLeaveRoom}
                            className="mt-4 px-6 py-2 rounded-lg bg-[#39ff14] text-[#0a0612] font-semibold hover:bg-[#2ed610]"
                        >
                            Play Again
                        </button>
                    </div>
                )}
            </div>

            {/* Search Modal */}
            <SearchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectPlayer={handleSelectPlayer}
                players={players}
                rowCategory={selectedCell ? TAG_LABELS[rowTags[selectedCell.row]] : ''}
                colCategory={selectedCell ? TAG_LABELS[colTags[selectedCell.col]] : ''}
            />
        </div>
    );
}

export default BoxCricket;
