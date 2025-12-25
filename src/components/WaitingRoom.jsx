import { useState } from 'react';
import { Copy, Check, Crown, UserCircle, Loader2 } from 'lucide-react';

/**
 * WaitingRoom Component - Post-join lobby
 * UX Principles Applied:
 * - Hick's Law: Simple interface, separate "My Status" from "Player List"
 * - Jakob's Law: Standard multiplayer patterns (Ready toggle, host controls)
 * - Zeigarnik Effect: Pulsing "Waiting for host..." indicator
 * - Fitts's Law: Large touch targets for mobile
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
    const otherPlayers = players.filter(p => p.id !== currentPlayerId);
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
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 flex flex-col items-center">
            <div className="w-full max-w-md mx-auto space-y-6">

                {/* Room Code Header */}
                <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">ROOM CODE</p>
                    <button
                        onClick={handleCopyRoomId}
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#1a1028] border-2 border-[#3d2259] hover:border-[#39ff14] transition-all group"
                    >
                        <span className="text-3xl sm:text-4xl font-mono font-bold tracking-[0.3em] text-white">
                            {roomId}
                        </span>
                        {copied ? (
                            <Check className="w-6 h-6 text-[#39ff14]" />
                        ) : (
                            <Copy className="w-6 h-6 text-gray-400 group-hover:text-[#39ff14]" />
                        )}
                    </button>
                    <p className="text-gray-500 text-xs mt-2">
                        {copied ? 'Copied!' : 'Tap to copy'}
                    </p>
                </div>

                {/* Separator */}
                <div className="border-t border-[#3d2259]" />

                {/* My Status Section - Hick's Law: Separated from player list */}
                <div className="glass-card rounded-2xl p-5">
                    <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
                        My Status
                    </h3>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#39ff14] to-[#2ed610] flex items-center justify-center text-[#0a0612] font-bold text-lg">
                                {currentPlayer?.name?.charAt(0)?.toUpperCase() || 'P'}
                            </div>
                            <div>
                                <p className="font-semibold text-white flex items-center gap-2">
                                    {currentPlayer?.name || 'You'}
                                    {isHost && (
                                        <Crown className="w-4 h-4 text-yellow-400" />
                                    )}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {isHost ? 'Host' : 'Player'}
                                </p>
                            </div>
                        </div>

                        {/* Ready Toggle - Large touch target (Fitts's Law) */}
                        <button
                            onClick={onToggleReady}
                            className={`
                                px-5 py-3 rounded-xl font-bold text-sm transition-all min-w-[100px]
                                ${isReady
                                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50'
                                    : 'bg-red-500/20 text-red-400 border-2 border-red-500/50 hover:bg-red-500/30'
                                }
                            `}
                        >
                            {isReady ? '✓ Ready' : 'Not Ready'}
                        </button>
                    </div>
                </div>

                {/* Players List - Jakob's Law: Standard multiplayer lobby pattern */}
                <div className="glass-card rounded-2xl p-5">
                    <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
                        Players ({players.length}/2)
                    </h3>

                    <div className="space-y-3">
                        {players.map((player, index) => (
                            <div
                                key={player.id}
                                className={`
                                    flex items-center justify-between p-3 rounded-xl
                                    ${player.id === currentPlayerId
                                        ? 'bg-[#39ff14]/10 border border-[#39ff14]/30'
                                        : 'bg-[#1a1028]'
                                    }
                                `}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Player Avatar */}
                                    <div
                                        className={`
                                            w-10 h-10 rounded-full flex items-center justify-center font-bold
                                            ${player.id === currentPlayerId
                                                ? 'bg-gradient-to-br from-[#39ff14] to-[#2ed610] text-[#0a0612]'
                                                : 'bg-[#3d2259] text-white'
                                            }
                                        `}
                                    >
                                        {player.name?.charAt(0)?.toUpperCase() || 'P'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white flex items-center gap-2">
                                            {player.name}
                                            {player.id === hostId && (
                                                <Crown className="w-4 h-4 text-yellow-400" />
                                            )}
                                            {player.id === currentPlayerId && (
                                                <span className="text-xs text-gray-500">(You)</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Ready Status Badge - Green/Red visual distinction */}
                                <span
                                    className={`
                                        px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                        ${player.isReady
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                        }
                                    `}
                                >
                                    {player.isReady ? 'Ready' : 'Waiting'}
                                </span>
                            </div>
                        ))}

                        {/* Empty slot placeholder */}
                        {players.length < 2 && (
                            <div className="flex items-center justify-center p-4 rounded-xl border-2 border-dashed border-[#3d2259] text-gray-500">
                                <UserCircle className="w-5 h-5 mr-2" />
                                Waiting for opponent...
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Button Area - Bottom of screen for thumb zone (Fitts's Law) */}
                <div className="pt-4">
                    {isHost ? (
                        /* Host: Start Game Button */
                        <button
                            onClick={onStartGame}
                            disabled={!canStartGame || isStarting}
                            className={`
                                w-full py-4 rounded-2xl font-bold text-lg transition-all
                                ${canStartGame && !isStarting
                                    ? 'bg-[#39ff14] text-[#0a0612] hover:bg-[#2ed610] neon-glow'
                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                }
                            `}
                        >
                            {isStarting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Starting...
                                </span>
                            ) : canStartGame ? (
                                'Start Game'
                            ) : players.length < 2 ? (
                                'Waiting for opponent...'
                            ) : (
                                'Waiting for all players to be ready'
                            )}
                        </button>
                    ) : (
                        /* Non-host: Waiting indicator with pulsing animation (Zeigarnik Effect) */
                        <div className="flex flex-col items-center py-4">
                            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[#1a1028] border border-[#3d2259]">
                                <div className="relative">
                                    <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
                                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-yellow-400 animate-ping opacity-50" />
                                </div>
                                <span className="text-gray-300 font-medium">
                                    Waiting for host to start...
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-3">
                                The host will start the game when everyone is ready
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default WaitingRoom;
