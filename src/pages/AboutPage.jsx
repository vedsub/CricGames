import Container from '../components/ui/Container';

/**
 * AboutPage Layout:
 * - Centered within Container
 * - Clear vertical flow: Title → Content Card → CTA
 */
function AboutPage() {
    return (
        <Container>
            <div className="max-w-[700px] mx-auto py-12">

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">About CricGames</h1>
                    <p className="text-neutral-400">
                        Your destination for cricket-themed games
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">
                        What is CricGames?
                    </h2>
                    <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                        CricGames is a collection of interactive cricket-themed puzzle and trivia games
                        designed for cricket enthusiasts. Whether you're a die-hard fan or a casual viewer,
                        our games offer a fun way to test your cricket knowledge.
                    </p>

                    <h2 className="text-lg font-semibold text-white mb-4">
                        Our Games
                    </h2>
                    <div className="space-y-3 mb-8">
                        <div className="bg-neutral-800 rounded-lg p-4">
                            <h3 className="font-medium text-white text-sm mb-1">Box Cricket</h3>
                            <p className="text-neutral-500 text-xs">Match players to categories in a grid-based puzzle game.</p>
                        </div>
                        <div className="bg-neutral-800 rounded-lg p-4">
                            <h3 className="font-medium text-white text-sm mb-1">Tenaball</h3>
                            <p className="text-neutral-500 text-xs">Race to name the Top 10 players in various cricket categories.</p>
                        </div>
                        <div className="bg-neutral-800 rounded-lg p-4">
                            <h3 className="font-medium text-white text-sm mb-1">Who Are You?</h3>
                            <p className="text-neutral-500 text-xs">Guess the mystery cricketer using clues about their career.</p>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold text-white mb-3">
                        Data Source
                    </h2>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                        Our game data is sourced from official cricket records and statistics.
                        We strive to keep our information accurate and up-to-date.
                    </p>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <a
                        href="/"
                        className="inline-block px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
                    >
                        Start Playing
                    </a>
                </div>
            </div>
        </Container>
    );
}

export default AboutPage;
