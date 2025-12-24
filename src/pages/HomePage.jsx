import GameCard from '../components/GameCard';

function HomePage() {
    const games = [
        {
            title: 'Box Cricket',
            description: 'Test your cricket knowledge in this thrilling grid-based puzzle game. Match players, stats, and achievements!',
            icon: '🎯',
            path: '/box-cricket',
            gradient: 'bg-gradient-to-br from-blue-500 to-purple-600'
        },
        {
            title: 'Tenaball',
            description: 'Can you name the Top 10? Race against time to complete cricket-themed lists and prove your expertise!',
            icon: '🔟',
            path: '/tenaball',
            gradient: 'bg-gradient-to-br from-green-500 to-teal-600'
        },
        {
            title: 'Who Are You?',
            description: 'Guess the mystery cricket player from clues! How many hints do you need to crack the code?',
            icon: '🤔',
            path: '/who-are-you',
            gradient: 'bg-gradient-to-br from-orange-500 to-red-600'
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-16 px-6 flex flex-col items-center">
            <div className="w-full max-w-6xl mx-auto px-8">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                        CricGames
                    </h1>

                    {/* Decorative Line */}
                    <div className="mt-4 flex items-center justify-center gap-3">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#39ff14]" />
                        <span className="text-[#39ff14] text-2xl">🏏</span>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#39ff14]" />
                    </div>
                </div>

                {/* Game Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
                    {games.map((game) => (
                        <GameCard
                            key={game.path}
                            title={game.title}
                            description={game.description}
                            icon={game.icon}
                            path={game.path}
                            gradient={game.gradient}
                        />
                    ))}
                </div>

                {/* Footer Text */}
                <div className="text-center mt-16 text-gray-500 text-sm">
                    <p>🏏 New games and features coming soon!</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
