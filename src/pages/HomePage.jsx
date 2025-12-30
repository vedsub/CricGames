import { Link } from 'react-router-dom';
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';

// SVG Icons for each game
const GridIcon = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const TopTenIcon = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
    </svg>
);

const MysteryIcon = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="5" />
        <path d="M3 21C3 17 7 14 12 14C17 14 21 17 21 21" />
        <text x="12" y="10" textAnchor="middle" fontSize="6" fill="currentColor" stroke="none">?</text>
    </svg>
);

/**
 * HomePage Layout:
 * - Hero: centered vertically and horizontally
 * - Game cards: grid layout with icons
 * - Each card: icon, title, description, CTA button
 */
function HomePage() {
    const games = [
        {
            title: 'Box Cricket',
            description: 'Match players to categories in a grid-based puzzle game.',
            path: '/box-cricket',
            icon: <GridIcon />,
            color: 'text-green-400'
        },
        {
            title: 'Tenaball',
            description: 'Name the Top 10 players in various cricket categories.',
            path: '/tenaball',
            icon: <TopTenIcon />,
            color: 'text-yellow-400'
        },
        {
            title: 'Who Are You?',
            description: 'Guess the mystery cricketer from clues about their career.',
            path: '/who-are-you',
            icon: <MysteryIcon />,
            color: 'text-blue-400'
        }
    ];

    return (
        <PageContainer maxWidth="1100px" className="py-16">
            {/* Hero Section - Centered */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">
                    CricGames
                </h1>
                <p className="text-neutral-400 text-lg max-w-md mx-auto">
                    Interactive cricket mini-games to test your knowledge
                </p>
            </div>

            {/* Game Cards Grid */}
            <div>
                <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-6">
                    Choose a game
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <Card key={game.path} className="flex flex-col">
                            {/* Icon */}
                            <div className={`mb-4 ${game.color}`}>
                                {game.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-white mb-2">
                                {game.title}
                            </h3>

                            {/* Description */}
                            <p className="text-neutral-400 text-sm mb-6 flex-1">
                                {game.description}
                            </p>

                            {/* CTA Button */}
                            <Link
                                to={game.path}
                                className="block w-full text-center py-2 px-4 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
                            >
                                Play
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
}

export default HomePage;
