/**
 * Container - Centered max-width wrapper
 * - max-width: 1100px
 * - margin: auto
 * - padding: 32px (px-8 py-8)
 */
function Container({ children, className = '' }) {
    return (
        <div className={`max-w-[1100px] mx-auto px-8 ${className}`}>
            {children}
        </div>
    );
}

export default Container;
