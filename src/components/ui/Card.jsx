import React from 'react';

/**
 * Card Component
 * 
 * Reusable card component following the global design system.
 * Requirements:
 * - dark surface background (#161616 -> bg-surface)
 * - subtle border (#222 -> border-border)
 * - rounded-lg (16px)
 * - p-6 padding (default)
 * - hover: shadow-lg + subtle elevation (for interactive variants)
 * - smooth transition 200ms
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.variant] - 'default' | 'elevated' | 'interactive'
 * @param {string} [props.padding] - 'none' | 'sm' | 'md' | 'lg'
 * @param {string} [props.className]
 */
const Card = ({
    children,
    variant = 'default',
    padding = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = 'bg-surface border border-border rounded-lg transition-all duration-200';

    const variants = {
        default: 'shadow-card',
        elevated: 'shadow-card-elevated', // Assuming this token might need to be defined or just use utility
        interactive: 'shadow-card hover:shadow-card-hover hover:-translate-y-1 cursor-pointer hover:border-primary/30',
    };

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    // Fallback for elevated if custom token missing, using standard Tailwind
    const variantStyles = variants[variant] || variants.default;

    return (
        <div
            className={`${baseStyles} ${variantStyles} ${paddings[padding]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
