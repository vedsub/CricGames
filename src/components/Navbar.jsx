import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

/**
 * Navbar - Responsive Navigation
 * Requirements:
 * - dark background (#0b0b0b -> bg-background)
 * - bottom border (#222 -> border-border)
 * - container matches PageContainer (max-w-6xl mx-auto px-6)
 * - logo on left, nav links right
 * - highlight active link (text-primary)
 * - collapsible hamburger on mobile
 */
function Navbar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'About', path: '/about' }
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Navbar Fixed Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-background border-b border-border">
                <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-xl font-bold text-white hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        CricGames
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-semibold transition-colors ${isActive(link.path)
                                        ? 'text-primary'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-surface rounded-md transition-colors"
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-[72px] z-40 bg-background/95 backdrop-blur-sm md:hidden">
                    <div className="flex flex-col p-6 space-y-4 border-b border-border bg-background">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block py-3 px-4 rounded-md text-lg font-medium transition-colors ${isActive(link.path)
                                        ? 'bg-surface text-primary border border-border'
                                        : 'text-gray-400 hover:text-white hover:bg-surface/50'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Spacer for fixed navbar */}
            <div className="h-[72px]" />
        </>
    );
}

export default Navbar;
