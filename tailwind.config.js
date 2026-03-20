/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#09090b', // Zinc 950
                surface: '#18181b', // Zinc 900
                'surface-highlight': '#27272a', // Zinc 800
                primary: '#ffffff', // White
                secondary: '#a1a1aa', // Zinc 400
                accent: '#f59e0b', // Amber 500
                'accent-dim': 'rgba(245, 158, 11, 0.1)',
                alert: '#ef4444', // Red 500
                success: '#10b981', // Emerald 500
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'gradient-subtle': 'linear-gradient(to bottom right, #18181b, #09090b)',
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
                'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            }
        },
    },
    plugins: [],
}
