import { useState } from 'react';
import { Plus, ArrowRight, User, Hash } from 'lucide-react';
import PageContainer from './ui/PageContainer';
import Card from './ui/Card';

/**
 * RoomLobby
 * 
 * Mode selection UI for Box Cricket.
 * Features:
 * - Centered Card layout
 * - 3 Stacked Options: Create, Join, Solo
 * - Consistent with global design system
 */
function RoomLobby({ onCreateRoom, onJoinRoom, isLoading, error }) {
    const [mode, setMode] = useState(null);
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
        <PageContainer className="flex items-center justify-center min-h-[calc(100vh-72px)]">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Box Cricket</h1>
                    <p className="text-gray-400">Choose a game mode to get started</p>
                </div>

                {/* Error Display */}
                {(error || inputError) && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error || inputError}
                    </div>
                )}

                <Card className="overflow-hidden">
                    {/* Main Mode Selection */}
                    {!mode && (
                        <div className="divide-y divide-border">
                            {/* Create Room */}
                            <button
                                onClick={() => setMode('create')}
                                disabled={isLoading}
                                className="w-full p-4 flex items-center gap-4 hover:bg-surface-hover hover:bg-white/5 transition-colors text-left group"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Plus className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Create Room</h3>
                                    <p className="text-xs text-gray-500">Host a new multiplayer game</p>
                                </div>
                            </button>

                            {/* Join Room */}
                            <button
                                onClick={() => setMode('join')}
                                disabled={isLoading}
                                className="w-full p-4 flex items-center gap-4 hover:bg-surface-hover hover:bg-white/5 transition-colors text-left group"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    <ArrowRight className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Join Room</h3>
                                    <p className="text-xs text-gray-500">Enter a code to join friends</p>
                                </div>
                            </button>

                            {/* Solo Play */}
                            <button
                                onClick={() => onCreateRoom(true)}
                                disabled={isLoading}
                                className="w-full p-4 flex items-center gap-4 hover:bg-surface-hover hover:bg-white/5 transition-colors text-left group"
                            >
                                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                                    <User className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Solo Play</h3>
                                    <p className="text-xs text-gray-500">Practice mode, no opponent</p>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Create Room View */}
                    {mode === 'create' && (
                        <div className="p-6">
                            <button
                                onClick={() => setMode(null)}
                                className="text-xs font-semibold text-gray-500 hover:text-white mb-6 flex items-center gap-1 transition-colors"
                            >
                                ← Back to modes
                            </button>

                            <div className="text-center space-y-6">
                                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                                    <Hash className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Create New Room</h3>
                                    <p className="text-sm text-gray-400">
                                        You'll get a unique code to share with your friend.
                                    </p>
                                </div>

                                <button
                                    onClick={handleCreate}
                                    disabled={isLoading}
                                    className="w-full py-3 bg-primary text-black font-bold rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Creating Room...' : 'Generate Code'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Join Room View */}
                    {mode === 'join' && (
                        <div className="p-6">
                            <button
                                onClick={() => setMode(null)}
                                className="text-xs font-semibold text-gray-500 hover:text-white mb-6 flex items-center gap-1 transition-colors"
                            >
                                ← Back to modes
                            </button>

                            <div className="text-center space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Join Room</h3>
                                    <p className="text-sm text-gray-400">
                                        Enter the 6-character code shared by your host.
                                    </p>
                                </div>

                                <input
                                    type="text"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
                                    placeholder="AB12CD"
                                    className="w-full bg-background border border-border rounded-md px-4 py-3 text-center text-2xl font-mono font-bold text-white tracking-widest focus:outline-none focus:border-primary transition-colors"
                                    autoFocus
                                />

                                <button
                                    onClick={handleJoin}
                                    disabled={isLoading || roomCode.length < 6}
                                    className="w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Joining...' : 'Enter Room'}
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </PageContainer>
    );
}

export default RoomLobby;
