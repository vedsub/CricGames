import { Link } from 'react-router-dom';

/**
 * Footer Layout:
 * - Content aligned to same 1100px container as page content
 * - Simple: logo, links, copyright
 */
function Footer() {
    return (
        <footer className="border-t border-neutral-800 bg-neutral-900">
            <div className="max-w-[1100px] mx-auto px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-neutral-500">
                    © {new Date().getFullYear()} CricGames
                </div>
                <div className="flex items-center gap-6 text-sm">
                    <Link to="/" className="text-neutral-400 hover:text-white">
                        Home
                    </Link>
                    <Link to="/about" className="text-neutral-400 hover:text-white">
                        About
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
