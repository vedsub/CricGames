import { Link } from 'react-router-dom';

function GameCard({ title, description, icon, path, gradient }) {
    return (
        <Link
            to={path}
            className="group relative overflow-hidden rounded-2xl glass-card p-10 transition-all duration-500 hover:scale-105 hover:neon-glow cursor-pointer"
        >
            {/* Background Gradient Overlay */}
            <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${gradient}`}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center gap-5">
                {/* Icon */}
                <div className="text-6xl mt-2 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white group-hover:text-[#39ff14] transition-colors duration-300">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                    {description}
                </p>

                {/* Play Button */}
                <div className="mt-2 px-6 py-2.5 rounded-full border-2 border-[#39ff14] text-[#39ff14] font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    PLAY NOW →
                </div>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#39ff14]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
    );
}

export default GameCard;
