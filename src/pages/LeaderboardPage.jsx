import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';

/**
 * LeaderboardPage Layout:
 * - Centered within PageContainer
 * - Clear vertical flow: Title → Coming Soon Card → CTA
 */
function LeaderboardPage() {
    return (
        <PageContainer maxWidth="600px" className="py-12">
            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Leaderboard</h1>
                <p className="text-neutral-400">
                    Track your scores and compete
                </p>
            </div>

            {/* Coming Soon Card */}
            <Card className="text-center mb-8">
                <h2 className="text-lg font-semibold text-white mb-2">
                    Coming Soon
                </h2>
                <p className="text-neutral-400 text-sm mb-6">
                    We're working on competitive leaderboards.
                    Track your scores, compete with friends, and climb to the top!
                </p>

                {/* Features Preview */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-neutral-800 rounded-lg p-3 text-center">
                        <h3 className="font-medium text-white text-xs">Rankings</h3>
                        <p className="text-neutral-500 text-xs mt-1">Global stats</p>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-3 text-center">
                        <h3 className="font-medium text-white text-xs">Stats</h3>
                        <p className="text-neutral-500 text-xs mt-1">Your progress</p>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-3 text-center">
                        <h3 className="font-medium text-white text-xs">Badges</h3>
                        <p className="text-neutral-500 text-xs mt-1">Achievements</p>
                    </div>
                </div>

                <a
                    href="/"
                    className="inline-block px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
                >
                    Play Games Now
                </a>
            </Card>
        </PageContainer>
    );
}

export default LeaderboardPage;
