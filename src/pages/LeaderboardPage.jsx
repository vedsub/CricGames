import { Trophy, BarChart2, Medal, Clock } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import Card from '../components/ui/Card';

/**
 * LeaderboardPage
 * 
 * Layout:
 * - Centered PageContainer
 * - Visual "Coming Soon" state
 * - Feature preview with icons
 */
function LeaderboardPage() {
    return (
        <PageContainer className="flex items-center justify-center py-12">
            <div className="w-full max-w-2xl text-center">

                <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
                <p className="text-gray-400 mb-8">Track your progress and compete globally</p>

                <Card className="p-8 border-border bg-surface text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-primary animate-pulse" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3">Coming Soon</h2>
                    <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                        We are building a comprehensive ranking system. Soon you'll be able to compare your cricket knowledge with fans worldwide.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-4 rounded-lg bg-background border border-border flex flex-col items-center">
                            <Trophy className="w-6 h-6 text-yellow-400 mb-2" />
                            <h3 className="font-bold text-white text-sm">Global Rankings</h3>
                            <p className="text-xs text-gray-500 mt-1">Compare daily scores</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background border border-border flex flex-col items-center">
                            <BarChart2 className="w-6 h-6 text-blue-400 mb-2" />
                            <h3 className="font-bold text-white text-sm">Detailed Stats</h3>
                            <p className="text-xs text-gray-500 mt-1">Analyze your performance</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background border border-border flex flex-col items-center">
                            <Medal className="w-6 h-6 text-purple-400 mb-2" />
                            <h3 className="font-bold text-white text-sm">Badges</h3>
                            <p className="text-xs text-gray-500 mt-1">Earn achievements</p>
                        </div>
                    </div>

                    <a
                        href="/"
                        className="inline-block px-8 py-3 bg-primary text-black font-bold rounded-md hover:bg-primary-hover transition-colors"
                    >
                        Back to Games
                    </a>
                </Card>
            </div>
        </PageContainer>
    );
}

export default LeaderboardPage;
