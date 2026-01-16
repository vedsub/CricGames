import React from 'react';

const DesignSystemPreview = () => {
    return (
        <div className="min-h-screen bg-background text-white p-8 space-y-12">
            <header className="space-y-4">
                <h1 className="text-4xl font-bold text-primary">CricGames Design System</h1>
                <p className="text-gray-400 max-w-2xl">
                    This is a preview of the global design system tokens, including colors, typography, spacing, and components.
                </p>
            </header>

            {/* Colors Section */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold border-b border-border pb-2">Colors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ColorCard name="Primary" customClass="bg-primary" hex="#2DD94C" />
                    <ColorCard name="Background" customClass="bg-background border border-border" hex="#0b0b0b" />
                    <ColorCard name="Surface" customClass="bg-surface" hex="#161616" />
                    <ColorCard name="Border" customClass="bg-border" hex="#222222" />
                </div>
            </section>

            {/* Typography Section */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold border-b border-border pb-2">Typography</h2>
                <div className="space-y-8 bg-surface p-6 rounded-lg border border-border">
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Heading XL / 36px / Bold</p>
                        <h1 className="text-4xl font-bold">The quick brown fox jumps over the lazy dog</h1>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Heading LG / 30px / Bold</p>
                        <h2 className="text-3xl font-bold">The quick brown fox jumps over the lazy dog</h2>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Heading MD / 24px / Semibold</p>
                        <h3 className="text-2xl font-semibold">The quick brown fox jumps over the lazy dog</h3>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Body / 16px / Normal</p>
                        <p className="text-base">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Caption / 14px / Normal</p>
                        <p className="text-sm text-gray-400">Copyright © 2024 CricGames. All rights reserved.</p>
                    </div>
                </div>
            </section>

            {/* Spacing & Radius Section */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold border-b border-border pb-2">Spacing & Radius</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Spacing */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-primary">Spacing Scale</h3>
                        <div className="flex flex-col gap-2 bg-surface p-4 rounded-md border border-border">
                            {[2, 3, 4, 6, 8, 12, 16].map((space) => (
                                <div key={space} className="flex items-center gap-4">
                                    <span className="w-8 text-sm text-gray-400">{space * 4}px</span>
                                    <div className={`h-4 bg-primary/20 rounded-sm`} style={{ width: `${space * 4}px` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Border Radius */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-primary">Border Radius</h3>
                        <div className="flex flex-col gap-4">
                            <div className="w-24 h-24 bg-surface border border-primary rounded-sm flex items-center justify-center text-xs">SM (6px)</div>
                            <div className="w-24 h-24 bg-surface border border-primary rounded-md flex items-center justify-center text-xs">MD (12px)</div>
                            <div className="w-24 h-24 bg-surface border border-primary rounded-lg flex items-center justify-center text-xs">LG (16px)</div>
                        </div>
                    </div>

                    {/* Shadows */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-primary">Elevation</h3>
                        <div className="w-32 h-32 bg-surface rounded-md shadow-card flex items-center justify-center text-sm mb-4">
                            Soft Shadow
                        </div>
                        <div className="w-32 h-32 bg-surface rounded-md shadow-card hover:shadow-card-hover transition-shadow duration-300 flex items-center justify-center text-sm cursor-pointer">
                            Hover Me
                        </div>
                    </div>
                </div>
            </section>

            {/* Components Section */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold border-b border-border pb-2">Components</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h3 className="text-xl font-bold mb-2">Standard Card</h3>
                        <p className="text-gray-400 mb-4">This uses the `.card` utility class with standard padding, border, and background tokens.</p>
                        <button className="bg-primary text-black px-4 py-2 rounded-md font-semibold hover:bg-primary-hover transition-colors">
                            Action Button
                        </button>
                    </div>

                    <div className="card-elevated p-6">
                        <h3 className="text-xl font-bold mb-2">Elevated Card</h3>
                        <p className="text-gray-400 mb-4">This uses `.card-elevated` which adds a subtle hover lift and shadow effect.</p>
                        <div className="flex gap-2">
                            <button className="bg-surface border border-border px-4 py-2 rounded-md hover:bg-white/5 transition-colors">
                                Secondary
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ColorCard = ({ name, customClass, hex }) => (
    <div className="flex items-center gap-4 bg-surface p-4 rounded-md border border-border">
        <div className={`w-12 h-12 rounded-full ${customClass} shadow-sm`}></div>
        <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-400 font-mono">{hex}</p>
        </div>
    </div>
);

export default DesignSystemPreview;
