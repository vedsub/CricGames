import React from 'react';

/**
 * PageContainer Component
 * 
 * A reusable layout wrapper that enforces the design system's max-width and centering.
 * requirements: max-w-6xl, mx-auto, px-6, py-12.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be rendered.
 * @param {string} [props.className] - Optional additional classes.
 */
const PageContainer = ({ children, className = '' }) => {
    return (
        <div className={`w-full min-h-screen bg-background ${className}`}>
            <div className="max-w-6xl mx-auto px-6 py-12">
                {children}
            </div>
        </div>
    );
};

export default PageContainer;
