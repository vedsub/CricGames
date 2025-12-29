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

    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-neutral-800">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-lg font-semibold text-white">Select a Player</h2>
                        <button
                            onClick={onClose}
                            className="text-neutral-400 hover:text-white p-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs text-neutral-500">
                        Must match: <span className="text-green-400">{rowCategory}</span> + <span className="text-green-400">{colCategory}</span>
                    </p>
                </div>

                {/* Search Input */}
                <div className="p-4 border-b border-neutral-800">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search players..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-green-500"
                    />
                </div>

                {/* Player List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {filteredPlayers.length === 0 ? (
                        <p className="text-center text-neutral-500 py-8 text-sm">No players found</p>
                    ) : (
                        <div className="space-y-1">
                            {filteredPlayers.map((player) => (
                                <button
                                    key={player.id}
                                    onClick={() => onSelectPlayer(player)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-800 transition-colors"
                                >
                                    <img
                                        src={player.image_url}
                                        alt={player.name}
                                        className="w-10 h-10 rounded-full object-cover bg-neutral-800"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/40?text=?';
                                        }}
                                    />
                                    <div className="text-left">
                                        <p className="font-medium text-white text-sm">
                                            {player.name}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {player.team} • {player.role}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchModal;
