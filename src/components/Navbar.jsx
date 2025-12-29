import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar - Fixed 64px height
 * - Content aligned to same 1100px container as page content
 * - Subtle bottom border for separation
 * - Active link clearly indicated
 */
function Navbar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'About', path: '/about' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Navbar - 64px height, bottom border */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-neutral-900 border-b border-neutral-800">
                {/* Inner content aligned to 1100px container */}
                <div className="max-w-[1100px] mx-auto px-8 h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-lg font-bold text-white">
                        CricGames
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors ${isActive(link.path)
                                        ? 'text-green-400'
                                        : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-neutral-400"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed top-16 left-0 right-0 z-40 bg-neutral-900 border-b border-neutral-800 md:hidden">
                    <div className="max-w-[1100px] mx-auto px-8 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block py-2 text-sm font-medium ${isActive(link.path)
                                        ? 'text-green-400'
                                        : 'text-neutral-400'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
