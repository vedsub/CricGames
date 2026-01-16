import { Link } from 'react-router-dom';
import { Grid, ListOrdered, Trophy, Play } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import Card from '../components/ui/Card';

const games = [
    {
        title: 'Box Cricket',
        description: 'Solve the grid! Match players to categories in this strategic puzzle game.',
        path: '/box-cricket',
        icon: Grid,
        color: 'text-primary'
    },
    {
        title: 'Tenaball',
        description: 'Think fast! Name the Top 10 players in various cricket categories.',
        path: '/tenaball',
        icon: ListOrdered,
        color: 'text-yellow-400'
    },
    {
        title: 'Who Are You?',
        description: 'Guess the mystery cricketer from clues about their career path.',
        path: '/who-are-you',
        icon: Trophy,
        color: 'text-blue-400'
    }
];

/**
 * Homepage Redesign
 * - Centered Hero with simplified styling matches new system
 * - Grid layout for game cards
 * - Uses global PageContainer and Card components
 */
function HomePage() {
    return (
        <PageContainer className="flex flex-col items-center justify-center">
            {/* Hero Section */}
            <div className="text-center mb-16 space-y-4 max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                    Cric<span className="text-primary">Games</span>
                </h1>
                <p className="text-xl text-gray-400 font-medium">
                    The ultimate destination for cricket trivia and puzzle enthusiasts.
                </p>
            </div>

            {/* Games Section */}
            <div className="w-full">
                <div className="text-center mb-8">
                    <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
                        Choose a Game
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {games.map((game) => {
                        const Icon = game.icon;
                        return (
                            <Card
                                key={game.path}
                                variant="interactive"
                                className="group flex flex-col h-full relative overflow-hidden"
                            >
                                {/* Hover Gradient Effect */}
                                <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />

                                <div className="relative z-10 flex flex-col flex-1">
                                    {/* Icon Header */}
                                    <div className={`w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center mb-6`}>
                                        <Icon className={`w-6 h-6 ${game.color}`} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                        {game.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-8 flex-1 leading-relaxed">
                                        {game.description}
                                    </p>

                                    {/* Action Button */}
                                    <Link
                                        to={game.path}
                                        className="inline-flex items-center justify-center w-full py-3 px-4 bg-primary text-black font-bold rounded-md hover:bg-primary-hover transition-all transform active:scale-95 space-x-2"
                                    >
                                        <span>Play Now</span>
                                        <Play className="w-4 h-4 fill-current" />
                                    </Link>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Footer subtle text */}
            <div className="mt-24 text-center text-sm text-gray-600">
                <p>&copy; 2024 CricGames. All rights reserved.</p>
            </div>
        </PageContainer>
    );
}

export default HomePage;
