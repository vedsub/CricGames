import { Info, Database, Gamepad2, Users, HelpCircle, Trophy } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import Card from '../components/ui/Card';

/**
 * AboutPage
 * 
 * Layout:
 * - Centered PageContainer (max-w-3xl)
 * - Sectioned content with icons
 * - Clear typography hierarchy
 */
function AboutPage() {
    return (
        <PageContainer className="py-12 flex justify-center">
            <div className="w-full max-w-3xl space-y-8">

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">About CricGames</h1>
                    <p className="text-gray-400">The ultimate destination for cricket trivia fanatics</p>
                </div>

                <Card className="overflow-hidden bg-surface border-border">
                    {/* Intro Section */}
                    <div className="p-8 border-b border-border">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Info className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
                                <p className="text-gray-400 leading-relaxed">
                                    CricGames was built to challenge cricket fans with engaging, data-driven puzzles.
                                    We believe cricket knowledge goes beyond just remembering stats—it's about understanding the game's history, players, and moments.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Games Section */}
                    <div className="p-8 bg-background/30">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Gamepad2 className="w-5 h-5 text-gray-400" />
                            Current Games
                        </h3>
                        <div className="grid gap-4">
                            <div className="group p-4 rounded-lg bg-surface border border-border hover:border-primary/50 transition-colors flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-primary transition-colors">Box Cricket</h4>
                                    <p className="text-sm text-gray-400">Grid-based connection puzzle. Match players to categories.</p>
                                </div>
                            </div>

                            <div className="group p-4 rounded-lg bg-surface border border-border hover:border-primary/50 transition-colors flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-primary transition-colors">Tenaball</h4>
                                    <p className="text-sm text-gray-400">Race against time to name the Top 10 players in a category.</p>
                                </div>
                            </div>

                            <div className="group p-4 rounded-lg bg-surface border border-border hover:border-primary/50 transition-colors flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <HelpCircle className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-primary transition-colors">Who Are You?</h4>
                                    <p className="text-sm text-gray-400">Deduce the mystery player from blurred photos and career stats.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Source */}
                    <div className="p-8 border-t border-border">
                        <div className="flex items-center gap-3 mb-2">
                            <Database className="w-5 h-5 text-gray-400" />
                            <h3 className="font-bold text-white">Data Sources</h3>
                        </div>
                        <p className="text-sm text-gray-500 ml-8">
                            Game data is processed from official records and widely available cricket databases.
                            We regularly update our datasets to ensure accuracy for recent matches and player stats.
                        </p>
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
}

export default AboutPage;
