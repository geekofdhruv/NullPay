/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Base
                background: '#000000', // Pure black
                foreground: '#ffffff',

                // The "Void" - Deep darks
                'void-main': '#02040a', // Slightly blueish black
                'void-lighter': '#0a0c14',

                // Neon Accents
                'neon-primary': '#00f3ff', // Electric Cyan
                'neon-secondary': '#7000ff',  // Electric Purple
                'neon-accent': '#0066ff', // Deep Blue

                // Glass States
                'glass-border': 'rgba(0, 243, 255, 0.15)', // Cyan border
                'glass-border-hover': 'rgba(0, 243, 255, 0.3)',
                'glass-surface': 'rgba(2, 8, 20, 0.5)', // Dark Blue/Black Glass (Not White)
                'glass-highlight': 'rgba(0, 243, 255, 0.05)',

                // Status
                success: '#00ffa3', // Keep Green for success
                error: '#ff3366',
                warning: '#ffaa00',
            },
            fontFamily: {
                sans: ['Space Grotesk', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                'glass-gradient-hover': 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 3s infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(0, 243, 255, 0.2), 0 0 10px rgba(0, 243, 255, 0.1)' },
                    '100%': { boxShadow: '0 0 20px rgba(0, 243, 255, 0.6), 0 0 40px rgba(0, 243, 255, 0.3)' },
                }
            },
            boxShadow: {
                'neon': '0 0 5px theme("colors.neon-primary"), 0 0 20px theme("colors.neon-primary")',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glass-hover': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
            }
        },
    },
    plugins: [],
}
