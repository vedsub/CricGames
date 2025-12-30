/**
 * PageContainer - Page-level wrapper with centered content panel
 * 
 * Global layout: max-width 1200px, 48px vertical / 24px horizontal padding
 * Inner content can have a custom maxWidth for game panels
 * 
 * @param {string} maxWidth - Max width of inner content (default: full width)
 * @param {string} className - Additional classes for inner wrapper
 */
function PageContainer({ children, maxWidth, className = '' }) {
    return (
        <div className="max-w-[1200px] mx-auto px-6 py-12">
            {maxWidth ? (
                <div
                    className={`mx-auto ${className}`}
                    style={{ maxWidth }}
                >
                    {children}
                </div>
            ) : (
                <div className={className}>
                    {children}
                </div>
            )}
        </div>
    );
}

export default PageContainer;
