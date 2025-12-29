import { Link } from 'react-router-dom';

function GameCard({ title, description, icon, path }) {
    return (
        <Link
            to={path}
            className="group block p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
            <div className="flex items-start gap-4">
                {/* Icon - subtle */}
                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-lg shrink-0">
                    {icon}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-base font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            {/* Play indicator */}
            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-500">Click to play</span>
                <svg
                    className="w-4 h-4 text-neutral-500 group-hover:text-green-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
}

export default GameCard;
