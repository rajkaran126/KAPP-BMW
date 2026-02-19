import { useState } from 'react';

/**
 * Floating BMW-themed Chat Icon
 * Opens chat panel when clicked
 */
export default function ChatIcon({ onClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed bottom-8 right-8 z-50 
                 w-16 h-16 rounded-full gradient-bmw
                 shadow-2xl hover:shadow-bmw-blue/50
                 transform transition-all duration-300
                 hover:scale-110 active:scale-95
                 flex items-center justify-center group"
            aria-label="Open Chat"
        >
            {/* Chat Icon */}
            <svg
                className="w-8 h-8 text-white transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
            </svg>

            {/* Pulse Animation */}
            {!isHovered && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-bmw-blue opacity-75 animate-ping" />
            )}

            {/* Tooltip */}
            {isHovered && (
                <div className="absolute right-20 bg-graphite-light px-4 py-2 rounded-lg
                        text-sm text-white whitespace-nowrap shadow-xl">
                    Chat with BMW AI Assistant
                </div>
            )}
        </button>
    );
}
