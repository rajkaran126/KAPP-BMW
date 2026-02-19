/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'graphite': {
                    DEFAULT: '#111111',
                    light: '#1a1a1a',
                    dark: '#000000',
                },
                'bmw-blue': {
                    DEFAULT: '#1c69d4',
                    light: '#8aa4ff',
                    dark: '#0d47a1',
                },
                'warm-beige': {
                    DEFAULT: '#d6c2a1',
                    light: '#f5ead5',
                    dark: '#b8a483',
                },
                'warm-brown': {
                    DEFAULT: '#8b7355',
                    light: '#a68968',
                    dark: '#6b5842',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['BMW Helvetica', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'fade-in': 'fadeIn 0.6s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
