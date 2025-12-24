import { useState, useEffect, useRef } from 'react';

function SearchModal({ isOpen, onClose, onSelectPlayer, players, rowCategory, colCategory }) {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isOpen) {
            setSearchTerm('');
        }
    }, [isOpen]);

    // Filter players based on search
    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 glass-card rounded-2xl p-6 max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">Select a Player</h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Must match: <span className="text-[#39ff14]">{rowCategory}</span> + <span className="text-[#39ff14]">{colCategory}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-4">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search players..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#1a1028] border border-[#3d2259] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#39ff14] transition-colors"
                    />
                </div>

                {/* Player List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {filteredPlayers.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No players found</p>
                    ) : (
                        filteredPlayers.map((player) => (
                            <button
                                key={player.id}
                                onClick={() => onSelectPlayer(player)}
                                className="w-full flex items-center gap-4 p-3 rounded-xl bg-[#1a1028] hover:bg-[#251438] border border-transparent hover:border-[#39ff14]/30 transition-all group"
                            >
                                <img
                                    src={player.image_url}
                                    alt={player.name}
                                    className="w-12 h-12 rounded-full object-cover bg-[#251438]"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/48?text=?';
                                    }}
                                />
                                <div className="text-left">
                                    <p className="font-semibold text-white group-hover:text-[#39ff14] transition-colors">
                                        {player.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {player.team} • {player.role}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchModal;
