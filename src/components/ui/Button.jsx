import { Link } from 'react-router-dom';

function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    to,
    className = '',
    ...props
}) {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus-ring';

    const variants = {
        primary: 'bg-green-500 text-white hover:bg-green-600',
        secondary: 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700',
        ghost: 'text-neutral-300 hover:text-white hover:bg-neutral-800',
        outline: 'border border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2.5 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={classes} {...props}>
                {children}
            </a>
        );
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}

export default Button;
