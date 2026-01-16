import { Github, Twitter, MessageCircle } from 'lucide-react';

/**
 * Footer Component
 * 
 * Requirements:
 * - dark background (bg-background)
 * - top border (border-border)
 * - centered text: "© 2025 CricGames"
 * - social icons row beneath
 * - responsive spacing
 */
function Footer() {
    return (
        <footer className="w-full bg-background border-t border-border py-8 mt-auto">
            <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-6">

                {/* Copyright Text */}
                <div className="text-gray-400 text-sm font-medium">
                    &copy; 2025 CricGames
                </div>

                {/* Social Icons Row */}
                <div className="flex items-center gap-6">
                    <a
                        href="https://discord.gg/cricgames"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-[#5865F2] transition-colors p-2 rounded-full hover:bg-surface"
                        aria-label="Discord"
                    >
                        {/* Using MessageCircle as generic community icon or custom SVG could go here */}
                        {/* Discord Brand color is #5865F2. Keeping it consistent with Lucide for now. */}
                        <MessageCircle size={20} />
                    </a>

                    <a
                        href="https://github.com/vedsub/CricGames"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-surface"
                        aria-label="GitHub"
                    >
                        <Github size={20} />
                    </a>

                    <a
                        href="https://twitter.com/cricgames"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-[#1DA1F2] transition-colors p-2 rounded-full hover:bg-surface"
                        aria-label="Twitter"
                    >
                        <Twitter size={20} />
                    </a>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
