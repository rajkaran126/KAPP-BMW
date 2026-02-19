/**
 * Hero Overlay - Minimal elegant UI overlay on hero section
 */
export default function HeroOverlay() {
    return (
        <div className="overlay-ui top-0 left-0 w-full h-screen flex flex-col items-center justify-center">
            <div className="fade-in-up text-center space-y-6 px-4">
                {/* Main Title */}
                <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight">
                    KAPP-BMW
                    <span className="block text-bmw-blue-light">AUTOMOBILE</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Experience the ultimate driving machine in our immersive 3D showroom
                </p>

                {/* CTA Buttons */}
                <div className="flex items-center justify-center space-x-4 pt-6">
                    <button
                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                        className="btn-primary"
                    >
                        Explore Collection
                    </button>
                    <button className="btn-primary">
                        Book Test Drive
                    </button>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-bmw-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <p className="text-sm text-gray-400 mt-2">Scroll to explore</p>
                </div>
            </div>
        </div>
    );
}
