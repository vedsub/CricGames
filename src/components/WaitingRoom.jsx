function WaitingRoom({ roomCode, onLeave, isHost }) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomCode);
    };

    return (
        <div className="min-h-screen pt-32 pb-16 px-6 flex flex-col items-center">
            <div className="w-full max-w-lg mx-auto text-center">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                        Room Created!
                    </h1>
                </div>

                {/* Room Code Card */}
                <div className="glass-card rounded-3xl p-8 mb-8">
                    <p className="text-gray-400 mb-4">Share this code with your opponent:</p>

                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="text-5xl font-mono tracking-[0.3em] text-[#39ff14] font-bold neon-text-glow">
                            {roomCode}
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="p-3 rounded-xl bg-[#1a1028] hover:bg-[#251438] transition-colors"
                            title="Copy to clipboard"
                        >
                            <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>

                    {/* Waiting Spinner */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-[#3d2259] rounded-full"></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#39ff14] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-gray-400 text-lg">
                            Waiting for opponent to join...
                        </p>
                    </div>
                </div>

                {/* Info */}
                <p className="text-gray-500 text-sm mb-8">
                    {isHost ? 'You will select the categories once your opponent joins.' : 'The host will select the categories.'}
                </p>

                {/* Leave Button */}
                <button
                    onClick={onLeave}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                >
                    Leave Room
                </button>
            </div>
        </div>
    );
}

export default WaitingRoom;
