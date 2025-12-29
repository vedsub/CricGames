import { useState } from 'react';
import Container from './ui/Container';

/**
 * RoomLobby Layout:
 * - Centered card with stacked actions
 * - Clear vertical flow: Title → Description → Actions
 * - No left-aligned floating buttons
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
        <Container>
            {/* Centered Panel - max 480px */}
            <div className="max-w-[480px] mx-auto py-16">

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Box Cricket</h1>
                    <p className="text-neutral-400">Choose how you want to play</p>
                </div>

                {/* Error */}
                {(error || inputError) && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm text-center">
                        {error || inputError}
                    </div>
                )}

                {/* Action Card */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">

                    {/* Mode Selection - Stacked */}
                    {!mode && (
                        <div className="space-y-3">
                            <button
                                onClick={() => setMode('create')}
                                disabled={isLoading}
                                className="w-full p-4 text-left bg-neutral-800 border border-neutral-700 rounded-lg hover:border-neutral-600"
                            >
                                <p className="font-semibold text-white">Create Room</p>
                                <p className="text-sm text-neutral-500">Start a new multiplayer game</p>
                            </button>

                            <button
                                onClick={() => setMode('join')}
                                disabled={isLoading}
                                className="w-full p-4 text-left bg-neutral-800 border border-neutral-700 rounded-lg hover:border-neutral-600"
                            >
                                <p className="font-semibold text-white">Join Room</p>
                                <p className="text-sm text-neutral-500">Enter a room code</p>
                            </button>

                            <div className="pt-4 border-t border-neutral-800">
                                <button
                                    onClick={() => onCreateRoom(true)}
                                    className="w-full p-4 text-left bg-neutral-800 border border-neutral-700 rounded-lg hover:border-neutral-600"
                                >
                                    <p className="font-semibold text-white">Solo Play</p>
                                    <p className="text-sm text-neutral-500">Practice by yourself</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Create Room Flow */}
                    {mode === 'create' && (
                        <div>
                            <button
                                onClick={() => setMode(null)}
                                className="text-sm text-neutral-500 hover:text-white mb-4"
                            >
                                ← Back
                            </button>

                            <div className="text-center">
                                <p className="text-neutral-400 mb-6">
                                    A room code will be generated for you to share.
                                </p>
                                <button
                                    onClick={handleCreate}
                                    disabled={isLoading}
                                    className="w-full py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:opacity-50"
                                >
                                    {isLoading ? 'Creating...' : 'Create Room'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Join Room Flow */}
                    {mode === 'join' && (
                        <div>
                            <button
                                onClick={() => setMode(null)}
                                className="text-sm text-neutral-500 hover:text-white mb-4"
                            >
                                ← Back
                            </button>

                            <div className="text-center">
                                <p className="text-neutral-400 mb-4">
                                    Enter the 6-character room code.
                                </p>
                                <input
                                    type="text"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
                                    placeholder="XXXXXX"
                                    maxLength={6}
                                    className="w-full text-center text-2xl font-mono tracking-widest px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-green-500 mb-4"
                                />
                                <button
                                    onClick={handleJoin}
                                    disabled={isLoading || roomCode.length !== 6}
                                    className="w-full py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:opacity-50"
                                >
                                    {isLoading ? 'Joining...' : 'Join Room'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}

export default RoomLobby;
