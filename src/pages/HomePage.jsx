import { Link } from 'react-router-dom';
import Container from '../components/ui/Container';

/**
 * HomePage Layout:
 * - Hero: centered vertically and horizontally
 * - Game cards: grid layout (not list)
 * - Each card: title, description, CTA button
 */
function HomePage() {
    const games = [
        {
            title: 'Box Cricket',
            description: 'Match players to categories in a grid-based puzzle game.',
            path: '/box-cricket'
        },
        {
            title: 'Tenaball',
            description: 'Name the Top 10 players in various cricket categories.',
            path: '/tenaball'
        },
        {
            title: 'Who Are You?',
            description: 'Guess the mystery cricketer from clues about their career.',
            path: '/who-are-you'
        }
    ];

    return (
        <Container>
            {/* Hero Section - Centered */}
            <div className="py-16 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                    CricGames
                </h1>
                <p className="text-neutral-400 text-lg max-w-md mx-auto">
                    Interactive cricket mini-games to test your knowledge
                </p>
            </div>

            {/* Game Cards Grid */}
            <div className="pb-16">
                <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-6">
                    Choose a game
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <div
                            key={game.path}
                            className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 flex flex-col"
                        >
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
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
}

export default HomePage;
