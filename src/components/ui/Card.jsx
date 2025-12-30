/**
 * Card - Reusable card component with consistent styling
 * 
 * @param {string} variant - 'default' | 'elevated' | 'interactive'
 * @param {string} padding - 'sm' | 'md' | 'lg' | 'none'
 * @param {string} className - Additional classes
 */
function Card({
    children,
    variant = 'default',
    padding = 'md',
    className = '',
    ...props
}) {
    const baseClasses = 'bg-neutral-900 border border-neutral-800 rounded-lg';

    const variants = {
        default: '',
        elevated: 'shadow-lg',
        interactive: 'hover:border-neutral-700 transition-colors cursor-pointer'
    };

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${className}`;

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
}

export default Card;
