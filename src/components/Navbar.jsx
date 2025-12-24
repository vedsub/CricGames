import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <span className="text-3xl">🏏</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-[#39ff14] group-hover:to-[#2ed610] transition-all duration-300">
                        CricGames
                    </span>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-4">
                    {!isHome && (
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#39ff14] text-[#0a0612] font-semibold hover:bg-[#2ed610] transition-all duration-300 neon-glow"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
