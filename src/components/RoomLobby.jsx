import { useState } from 'react';

function RoomLobby({ onCreateRoom, onJoinRoom, isLoading, error }) {
    const [mode, setMode] = useState(null); // 'create' | 'join'
    const [roomCode, setRoomCode] = useState('');
    const [inputError, setInputError] = useState('');

    const handleCreate = () => {
        onCreateRoom();
    };

    const handleJoin = () => {
        const code = roomCode.trim().toUpperCase();
        if (code.length !== 6) {
            setInputError('Room code must be 6 characters');
            return;
        }
        setInputError('');
        onJoinRoom(code);
    };

    return (
        <div className="min-h-screen pt-32 pb-16 px-6 flex flex-col items-center">
            <div className="w-full max-w-lg mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                        Box Cricket
                    </h1>
                    <p className="text-xl text-gray-400">
                        Real-time 1v1 Multiplayer
                    </p>
                </div>

                {/* Error Message */}
                {(error || inputError) && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-center">
                        {error || inputError}
                    </div>
                )}

                {/* Mode Selection */}
                {!mode && (
                    <div className="space-y-4">
                        <button
                            onClick={() => setMode('create')}
                            disabled={isLoading}
                            className="w-full p-6 rounded-2xl glass-card hover:border-[#39ff14]/50 border-2 border-transparent transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <span className="w-16 h-16 rounded-xl bg-[#39ff14] flex items-center justify-center text-3xl">
                                    🎮
                                </span>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-white group-hover:text-[#39ff14] transition-colors">
                                        Create Room
                                    </h3>
                                    <p className="text-gray-400 text-sm">Start a new game and invite a friend</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => setMode('join')}
                            disabled={isLoading}
                            className="w-full p-6 rounded-2xl glass-card hover:border-[#39ff14]/50 border-2 border-transparent transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <span className="w-16 h-16 rounded-xl bg-[#251438] flex items-center justify-center text-3xl">
                                    🔗
                                </span>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-white group-hover:text-[#39ff14] transition-colors">
                                        Join Room
                                    </h3>
                                    <p className="text-gray-400 text-sm">Enter a room code to join a game</p>
                                </div>
                            </div>
                        </button>

                        {/* Solo Play Option */}
                        <div className="text-center mt-8">
                            <button
                                onClick={() => onCreateRoom(true)} // solo mode
                                className="text-gray-500 hover:text-gray-300 text-sm underline"
                            >
                                Or play solo without multiplayer →
                            </button>
                        </div>
                    </div>
                )}

                {/* Create Room Flow */}
                {mode === 'create' && (
                    <div className="glass-card rounded-3xl p-8">
                        <button
                            onClick={() => setMode(null)}
                            className="text-gray-400 hover:text-white mb-6 flex items-center gap-2"
                        >
                            ← Back
                        </button>

                        <div className="text-center">
                            <span className="text-6xl mb-6 block">🎮</span>
                            <h3 className="text-2xl font-bold mb-4">Create a New Room</h3>
                            <p className="text-gray-400 mb-8">
                                A 6-character room code will be generated for you to share with your opponent.
                            </p>

                            <button
                                onClick={handleCreate}
                                disabled={isLoading}
                                className="px-8 py-4 rounded-xl bg-[#39ff14] text-[#0a0612] font-bold text-lg hover:bg-[#2ed610] transition-all neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </span>
                                ) : (
                                    'Create Room'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Join Room Flow */}
                {mode === 'join' && (
                    <div className="glass-card rounded-3xl p-8">
                        <button
                            onClick={() => setMode(null)}
                            className="text-gray-400 hover:text-white mb-6 flex items-center gap-2"
                        >
                            ← Back
                        </button>

                        <div className="text-center">
                            <span className="text-6xl mb-6 block">🔗</span>
                            <h3 className="text-2xl font-bold mb-4">Join a Room</h3>
                            <p className="text-gray-400 mb-6">
                                Enter the 6-character code shared by your opponent.
                            </p>

                            <input
                                type="text"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
                                placeholder="XXXXXX"
                                maxLength={6}
                                className="w-full text-center text-4xl font-mono tracking-[0.5em] px-6 py-4 rounded-xl bg-[#1a1028] border-2 border-[#3d2259] text-white placeholder-gray-600 focus:outline-none focus:border-[#39ff14] mb-6"
                            />

                            <button
                                onClick={handleJoin}
                                disabled={isLoading || roomCode.length !== 6}
                                className="px-8 py-4 rounded-xl bg-[#39ff14] text-[#0a0612] font-bold text-lg hover:bg-[#2ed610] transition-all neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Joining...
                                    </span>
                                ) : (
                                    'Join Room'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RoomLobby;
