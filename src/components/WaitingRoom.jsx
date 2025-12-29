import { useState } from 'react';
import { Copy, Check, Crown, UserCircle, Loader2 } from 'lucide-react';
import Container from './ui/Container';

/**
 * WaitingRoom Layout:
 * - Centered within Container, max 480px
 * - Clear vertical flow: Room Code → Status Card → Players Card → Action
 */
function WaitingRoom({
    roomId,
    players = [],
    currentPlayerId,
    hostId,
    isReady,
    onToggleReady,
    onStartGame,
    isStarting = false
}) {
    const [copied, setCopied] = useState(false);

    const isHost = currentPlayerId === hostId;
    const currentPlayer = players.find(p => p.id === currentPlayerId);
    const allPlayersReady = players.every(p => p.isReady);
    const canStartGame = isHost && players.length >= 2 && allPlayersReady;

    const handleCopyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <Container>
            {/* Centered Panel - max 480px */}
            <div className="max-w-[480px] mx-auto py-12">

                {/* Room Code */}
                <div className="text-center mb-8">
                    <p className="text-neutral-500 text-xs uppercase tracking-wide mb-2">Room Code</p>
                    <button
                        onClick={handleCopyRoomId}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-neutral-600"
                    >
                        <span className="text-2xl font-mono font-bold tracking-widest text-white">
                            {roomId}
                        </span>
                        {copied ? (
                            <Check className="w-5 h-5 text-green-400" />
                        ) : (
                            <Copy className="w-5 h-5 text-neutral-500" />
                        )}
                    </button>
                    <p className="text-neutral-600 text-xs mt-2">
                        {copied ? 'Copied!' : 'Click to copy'}
                    </p>
                </div>

                {/* My Status Card */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-4">
                    <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">
                        My Status
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                                {currentPlayer?.name?.charAt(0)?.toUpperCase() || 'P'}
                            </div>
                            <div>
                                <p className="font-medium text-white text-sm flex items-center gap-2">
                                    {currentPlayer?.name || 'You'}
                                    {isHost && <Crown className="w-4 h-4 text-yellow-400" />}
                                </p>
                                <p className="text-neutral-500 text-xs">
                                    {isHost ? 'Host' : 'Player'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onToggleReady}
                            className={`px-4 py-2 rounded-lg font-medium text-sm ${isReady
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'
                                }`}
                        >
                            {isReady ? '✓ Ready' : 'Not Ready'}
                        </button>
                    </div>
                </div>

                {/* Players Card */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
                    <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">
                        Players ({players.length}/2)
                    </h3>
                    <div className="space-y-2">
                        {players.map((player) => (
                            <div
                                key={player.id}
                                className={`flex items-center justify-between p-3 rounded-lg ${player.id === currentPlayerId
                                        ? 'bg-green-500/5 border border-green-500/20'
                                        : 'bg-neutral-800'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${player.id === currentPlayerId
                                            ? 'bg-green-500 text-white'
                                            : 'bg-neutral-700 text-neutral-300'
                                        }`}>
                                        {player.name?.charAt(0)?.toUpperCase() || 'P'}
                                    </div>
                                    <p className="font-medium text-white text-sm flex items-center gap-2">
                                        {player.name}
                                        {player.id === hostId && <Crown className="w-3 h-3 text-yellow-400" />}
                                        {player.id === currentPlayerId && (
                                            <span className="text-xs text-neutral-500">(You)</span>
                                        )}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${player.isReady
                                        ? 'bg-green-500/10 text-green-400'
                                        : 'bg-neutral-700 text-neutral-400'
                                    }`}>
                                    {player.isReady ? 'Ready' : 'Waiting'}
                                </span>
                            </div>
                        ))}

                        {players.length < 2 && (
                            <div className="flex items-center justify-center p-3 rounded-lg border border-dashed border-neutral-700 text-neutral-500 text-sm">
                                <UserCircle className="w-4 h-4 mr-2" />
                                Waiting for opponent...
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                <div className="text-center">
                    {isHost ? (
                        <button
                            onClick={onStartGame}
                            disabled={!canStartGame || isStarting}
                            className={`w-full py-3 rounded-lg font-medium ${canStartGame && !isStarting
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                }`}
                        >
                            {isStarting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Starting...
                                </span>
                            ) : canStartGame ? (
                                'Start Game'
                            ) : players.length < 2 ? (
                                'Waiting for opponent...'
                            ) : (
                                'Waiting for players to ready'
                            )}
                        </button>
                    ) : (
                        <div className="py-4 px-4 bg-neutral-800 rounded-lg text-sm text-neutral-400 flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                            Waiting for host to start...
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}

export default WaitingRoom;
