import { useState } from 'react';

// Tag display names
const TAG_LABELS = {
    // Teams
    csk: 'Chennai Super Kings',
    mi: 'Mumbai Indians',
    rcb: 'Royal Challengers',
    kkr: 'Kolkata Knight Riders',
    dc: 'Delhi Capitals',
    rr: 'Rajasthan Royals',
    srh: 'Sunrisers Hyderabad',
    pbks: 'Punjab Kings',
    gt: 'Gujarat Titans',
    lsg: 'Lucknow Super Giants',
    // Era
    og: 'OG Era (2008-14)',
    '2010s': '2010s Era',
    '2020s': '2020s Era',
    recent: 'Recent Player',
    // Experience
    veteran: 'Veteran (100+ matches)',
    experienced: 'Experienced (50+ matches)',
    newcomer: 'Newcomer (<20 matches)',
    loyal: 'One-Club Player',
    journeyman: 'Played 4+ Teams',
    ipl: 'IPL Player',
    // Nationality
    india: 'Indian',
    overseas: 'Overseas Player',
    australia: 'Australian',
    england: 'English',
    southafrica: 'South African',
    westindies: 'West Indian',
    newzealand: 'New Zealander',
    // Awards & Achievements
    orangecap: 'Orange Cap Winner 🧡',
    purplecap: 'Purple Cap Winner 💜',
    mvp: 'MVP Award Winner',
    iccpoty: 'ICC Player of the Year',
    iplwinner: 'IPL Champion 🏆',
    captain: 'Team Captain',
    // Role
    batter: 'Batter',
    bowler: 'Bowler',
    allrounder: 'All-Rounder',
    wicketkeeper: 'Wicket-Keeper'
};

// Organize tags by category with proper headings
const TAG_GROUPS = [
    {
        id: 'teams',
        label: 'IPL Teams',
        emoji: '🏏',
        tags: ['csk', 'mi', 'rcb', 'kkr', 'dc', 'rr', 'srh', 'pbks', 'gt', 'lsg']
    },
    {
        id: 'nationality',
        label: 'Nationality',
        emoji: '🌍',
        tags: ['india', 'overseas', 'australia', 'england', 'southafrica', 'westindies', 'newzealand']
    },
    {
        id: 'awards',
        label: 'Awards & Achievements',
        emoji: '🏆',
        tags: ['orangecap', 'purplecap', 'mvp', 'iplwinner', 'captain']
    },
    {
        id: 'role',
        label: 'Playing Role',
        emoji: '🎯',
        tags: ['batter', 'bowler', 'allrounder', 'wicketkeeper']
    },
    {
        id: 'era',
        label: 'Era',
        emoji: '📅',
        tags: ['og', '2010s', '2020s', 'recent']
    },
    {
        id: 'experience',
        label: 'Experience',
        emoji: '⭐',
        tags: ['veteran', 'experienced', 'newcomer', 'loyal', 'journeyman']
    }
];

function TagSelector({ availableTags, onStartGame }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedCols, setSelectedCols] = useState([]);
    const [error, setError] = useState('');

    // Combine all available tags
    const allAvailableTags = [
        ...(availableTags.teams || []),
        ...(availableTags.era || []),
        ...(availableTags.experience || []),
        ...(availableTags.nationality || []),
        ...(availableTags.awards || []),
        ...(availableTags.role || [])
    ];

    const toggleTag = (tag, type) => {
        setError('');
        if (type === 'row') {
            if (selectedRows.includes(tag)) {
                setSelectedRows(selectedRows.filter(t => t !== tag));
            } else if (selectedRows.length < 3) {
                setSelectedRows([...selectedRows, tag]);
            }
        } else {
            if (selectedCols.includes(tag)) {
                setSelectedCols(selectedCols.filter(t => t !== tag));
            } else if (selectedCols.length < 3) {
                setSelectedCols([...selectedCols, tag]);
            }
        }
    };

    const handleStart = () => {
        if (selectedRows.length !== 3 || selectedCols.length !== 3) {
            setError('Please select exactly 3 row categories and 3 column categories');
            return;
        }

        const overlap = selectedRows.filter(r => selectedCols.includes(r));
        if (overlap.length > 0) {
            setError(`Can't use same category for both rows and columns`);
            return;
        }

        onStartGame(selectedRows, selectedCols);
    };

    const TagButton = ({ tag, type, selected, disabled }) => (
        <button
            onClick={() => toggleTag(tag, type)}
            disabled={disabled}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${selected
                ? 'bg-[#39ff14] text-[#0a0612] shadow-lg shadow-[#39ff14]/30'
                : disabled
                    ? 'bg-[#1a1028]/50 text-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-[#1a1028] text-gray-300 hover:bg-[#251438] hover:text-white border border-[#3d2259] hover:border-[#39ff14]/50'
                }`}
        >
            {TAG_LABELS[tag] || tag}
        </button>
    );

    const renderTagGroup = (group, type) => {
        const selected = type === 'row' ? selectedRows : selectedCols;
        const disabled = type === 'row' ? selectedCols : selectedRows;
        const availableInGroup = group.tags.filter(t => allAvailableTags.includes(t));

        if (availableInGroup.length === 0) return null;

        return (
            <div key={group.id} className="mb-8">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[#3d2259]">
                    <span className="text-2xl">{group.emoji}</span>
                    <h4 className="text-lg font-bold text-white">{group.label}</h4>
                    <span className="text-xs text-gray-500 ml-auto">{availableInGroup.length} options</span>
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-3">
                    {availableInGroup.map(tag => (
                        <TagButton
                            key={`${type}-${tag}`}
                            tag={tag}
                            type={type}
                            selected={selected.includes(tag)}
                            disabled={disabled.includes(tag)}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen pt-28 pb-16 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                        Box Cricket
                    </h1>
                    <p className="text-xl text-gray-400">
                        Select 3 categories for rows and 3 for columns
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-center">
                        {error}
                    </div>
                )}

                {/* Selection Panels */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Row Selection */}
                    <div className="glass-card rounded-3xl p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[#39ff14]/30">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <span className="w-12 h-12 rounded-xl bg-[#39ff14] flex items-center justify-center text-[#0a0612] text-xl font-black">↓</span>
                                <span>Row Categories</span>
                            </h3>
                            <span className="text-2xl font-mono">
                                <span className="text-[#39ff14] font-bold">{selectedRows.length}</span>
                                <span className="text-gray-500">/3</span>
                            </span>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto pr-2">
                            {TAG_GROUPS.map(group => renderTagGroup(group, 'row'))}
                        </div>
                    </div>

                    {/* Column Selection */}
                    <div className="glass-card rounded-3xl p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[#39ff14]/30">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <span className="w-12 h-12 rounded-xl bg-[#39ff14] flex items-center justify-center text-[#0a0612] text-xl font-black">→</span>
                                <span>Column Categories</span>
                            </h3>
                            <span className="text-2xl font-mono">
                                <span className="text-[#39ff14] font-bold">{selectedCols.length}</span>
                                <span className="text-gray-500">/3</span>
                            </span>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto pr-2">
                            {TAG_GROUPS.map(group => renderTagGroup(group, 'col'))}
                        </div>
                    </div>
                </div>

                {/* Preview + Start Button */}
                <div className="max-w-4xl mx-auto">
                    {/* Grid Preview */}
                    {(selectedRows.length > 0 || selectedCols.length > 0) && (
                        <div className="glass-card rounded-3xl p-8 mb-8">
                            <h3 className="text-xl font-bold mb-6 text-center">Grid Preview</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="p-4 w-48"></th>
                                            {selectedCols.map(col => (
                                                <th key={col} className="p-4 text-[#39ff14] font-semibold text-center text-sm">
                                                    {TAG_LABELS[col] || col}
                                                </th>
                                            ))}
                                            {Array(3 - selectedCols.length).fill(0).map((_, i) => (
                                                <th key={`empty-col-${i}`} className="p-4 text-gray-600 text-center">?</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedRows.map(row => (
                                            <tr key={row}>
                                                <td className="p-4 text-[#39ff14] font-semibold text-sm">{TAG_LABELS[row] || row}</td>
                                                {selectedCols.map(col => (
                                                    <td key={`${row}-${col}`} className="p-4 text-center">
                                                        <div className="w-20 h-20 mx-auto rounded-xl bg-[#1a1028] border-2 border-[#3d2259] flex items-center justify-center text-3xl text-gray-500">
                                                            ?
                                                        </div>
                                                    </td>
                                                ))}
                                                {Array(3 - selectedCols.length).fill(0).map((_, i) => (
                                                    <td key={`empty-${i}`} className="p-4 text-center">
                                                        <div className="w-20 h-20 mx-auto rounded-xl bg-[#0a0612]/50 border-2 border-dashed border-gray-700"></div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        {Array(3 - selectedRows.length).fill(0).map((_, i) => (
                                            <tr key={`empty-row-${i}`}>
                                                <td className="p-4 text-gray-600">?</td>
                                                {Array(3).fill(0).map((_, j) => (
                                                    <td key={`empty-${i}-${j}`} className="p-4 text-center">
                                                        <div className="w-20 h-20 mx-auto rounded-xl bg-[#0a0612]/50 border-2 border-dashed border-gray-700"></div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Start Button */}
                    <div className="text-center">
                        <button
                            onClick={handleStart}
                            disabled={selectedRows.length !== 3 || selectedCols.length !== 3}
                            className={`px-16 py-5 rounded-2xl font-bold text-xl transition-all duration-300 ${selectedRows.length === 3 && selectedCols.length === 3
                                ? 'bg-[#39ff14] text-[#0a0612] hover:bg-[#2ed610] neon-glow hover:scale-105'
                                : 'bg-[#1a1028] text-gray-500 cursor-not-allowed border border-[#3d2259]'
                                }`}
                        >
                            Start Game 🏏
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TagSelector;
export { TAG_LABELS };
