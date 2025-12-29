import { useState } from 'react';
import Container from './ui/Container';

/**
 * TagSelector Layout:
 * - Centered within Container
 * - Two-column layout for category selection
 * - Clear vertical flow: Title → Description → Selection Cards → Summary → Action
 */

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
    veteran: 'Veteran (100+)',
    experienced: 'Experienced (50+)',
    newcomer: 'Newcomer (<20)',
    loyal: 'One-Club Player',
    journeyman: '4+ Teams',
    ipl: 'IPL Player',
    // Nationality
    india: 'Indian',
    overseas: 'Overseas',
    australia: 'Australian',
    england: 'English',
    southafrica: 'South African',
    westindies: 'West Indian',
    newzealand: 'New Zealander',
    // Awards
    orangecap: 'Orange Cap',
    purplecap: 'Purple Cap',
    mvp: 'MVP',
    iccpoty: 'ICC POY',
    iplwinner: 'IPL Champion',
    captain: 'Captain',
    // Role
    batter: 'Batter',
    bowler: 'Bowler',
    allrounder: 'All-Rounder',
    wicketkeeper: 'Keeper'
};

const TAG_GROUPS = [
    { id: 'teams', label: 'Teams', tags: ['csk', 'mi', 'rcb', 'kkr', 'dc', 'rr', 'srh', 'pbks', 'gt', 'lsg'] },
    { id: 'nationality', label: 'Nationality', tags: ['india', 'overseas', 'australia', 'england', 'southafrica', 'westindies', 'newzealand'] },
    { id: 'awards', label: 'Awards', tags: ['orangecap', 'purplecap', 'mvp', 'iplwinner', 'captain'] },
    { id: 'role', label: 'Role', tags: ['batter', 'bowler', 'allrounder', 'wicketkeeper'] },
    { id: 'era', label: 'Era', tags: ['og', '2010s', '2020s', 'recent'] },
    { id: 'experience', label: 'Experience', tags: ['veteran', 'experienced', 'newcomer', 'loyal', 'journeyman'] }
];

function TagSelector({ availableTags, onStartGame }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedCols, setSelectedCols] = useState([]);
    const [error, setError] = useState('');
    const [expandedGroups, setExpandedGroups] = useState(['teams', 'role']);

    const allAvailableTags = [
        ...(availableTags.teams || []),
        ...(availableTags.era || []),
        ...(availableTags.experience || []),
        ...(availableTags.nationality || []),
        ...(availableTags.awards || []),
        ...(availableTags.role || [])
    ];

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

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
            setError('Select exactly 3 categories for each');
            return;
        }

        const overlap = selectedRows.filter(r => selectedCols.includes(r));
        if (overlap.length > 0) {
            setError("Can't use same category for both");
            return;
        }

        onStartGame(selectedRows, selectedCols);
    };

    const TagPill = ({ tag, type, selected, disabled }) => (
        <button
            onClick={() => toggleTag(tag, type)}
            disabled={disabled}
            className={`px-3 py-1.5 rounded text-sm font-medium ${selected
                    ? 'bg-green-500 text-white'
                    : disabled
                        ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
        >
            {TAG_LABELS[tag] || tag}
        </button>
    );

    const renderTagGroup = (group, type) => {
        const selected = type === 'row' ? selectedRows : selectedCols;
        const disabled = type === 'row' ? selectedCols : selectedRows;
        const availableInGroup = group.tags.filter(t => allAvailableTags.includes(t));
        const isExpanded = expandedGroups.includes(group.id);

        if (availableInGroup.length === 0) return null;

        return (
            <div key={group.id} className="border-b border-neutral-800 last:border-b-0">
                <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between py-3 text-left"
                >
                    <span className="text-sm font-medium text-neutral-300">{group.label}</span>
                    <svg
                        className={`w-4 h-4 text-neutral-500 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {isExpanded && (
                    <div className="flex flex-wrap gap-2 pb-4">
                        {availableInGroup.map(tag => (
                            <TagPill
                                key={`${type}-${tag}`}
                                tag={tag}
                                type={type}
                                selected={selected.includes(tag)}
                                disabled={disabled.includes(tag)}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Container>
            {/* Centered Panel */}
            <div className="max-w-[900px] mx-auto py-8">

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Box Cricket</h1>
                    <p className="text-neutral-400">
                        Select 3 categories for rows and 3 for columns to create your puzzle grid
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="max-w-md mx-auto mb-6 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Two Column Selection Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Row Categories Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
                            <h3 className="font-medium text-white">Row Categories</h3>
                            <span className="text-xs text-neutral-500">{selectedRows.length}/3</span>
                        </div>
                        <div className="p-4">
                            {TAG_GROUPS.map(group => renderTagGroup(group, 'row'))}
                        </div>
                    </div>

                    {/* Column Categories Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
                            <h3 className="font-medium text-white">Column Categories</h3>
                            <span className="text-xs text-neutral-500">{selectedCols.length}/3</span>
                        </div>
                        <div className="p-4">
                            {TAG_GROUPS.map(group => renderTagGroup(group, 'col'))}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                {(selectedRows.length > 0 || selectedCols.length > 0) && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-neutral-500">Rows: </span>
                                <span className="text-white">
                                    {selectedRows.length > 0
                                        ? selectedRows.map(t => TAG_LABELS[t]).join(', ')
                                        : 'None selected'
                                    }
                                </span>
                            </div>
                            <div>
                                <span className="text-neutral-500">Columns: </span>
                                <span className="text-white">
                                    {selectedCols.length > 0
                                        ? selectedCols.map(t => TAG_LABELS[t]).join(', ')
                                        : 'None selected'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="text-center">
                    <button
                        onClick={handleStart}
                        disabled={selectedRows.length !== 3 || selectedCols.length !== 3}
                        className={`px-8 py-3 rounded-lg font-medium ${selectedRows.length === 3 && selectedCols.length === 3
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            }`}
                    >
                        Start Game
                    </button>
                </div>
            </div>
        </Container>
    );
}

export default TagSelector;
export { TAG_LABELS };
