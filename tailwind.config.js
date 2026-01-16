/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0b0b0b',
                surface: '#161616',
                primary: {
                    DEFAULT: '#2DD94C', // Primary accent green
                    hover: '#25b840',
                },
                border: {
                    DEFAULT: '#222222',
                    subtle: '#222222',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                sm: '6px',
                md: '12px',
                lg: '16px',
            },
            spacing: {
                '12': '3rem', // Tailwind default is 3rem for 12, but user asked for specific scale 8/12/16... check if default suffices. 
                // 8=2rem is default 8. 12=3rem is default 12. 
                // 8px = 0.5rem (unit 2). 12px = 0.75rem (unit 3). 
                // User Spacing scale: 8/12/16/24/32/48/64 px.
                // Tailwind defaults (rem):
                // 2 (0.5rem/8px), 3 (0.75rem/12px), 4 (1rem/16px), 6 (1.5rem/24px), 8 (2rem/32px), 12 (3rem/48px), 16 (4rem/64px).
                // It seems standard Tailwind spacing 2, 3, 4, 6, 8, 12, 16 maps exactly to these pixels.
                // So no explicit spacing overrides needed unless re-mapping names.
            },
            maxWidth: {
                '6xl': '72rem', // 1152px
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
            }
        },
        container: {
            center: true,
            padding: '1rem',
            screens: {
                lg: '1152px', // max-w-6xl
                xl: '1152px',
                '2xl': '1152px',
            },
        },
    },
    plugins: [],
}
