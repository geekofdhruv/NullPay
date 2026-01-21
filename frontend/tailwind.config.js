/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-black': '#000000',
                'bg-dark': '#0a0a0a',
                'green-primary': '#00ff88',
                'green-secondary': '#00d4aa',
                'green-light': '#88ffbb',
                'text-gray': '#888888',
                'text-muted': '#555555',
                'status-pending': '#ffaa00',
                'status-settled': '#00ff88',
                'status-expired': '#ff3366',
            },
        },
    },
    plugins: [],
}
