import { useRef, useEffect, useState } from 'react';

/**
 * Video Background - Cinematic BMW promo video
 * Auto-plays muted with warm tint overlay
 */
export default function VideoBackground({ videoSrc }) {
    const videoRef = useRef(null);
    const [videoError, setVideoError] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.log('Video autoplay failed:', error);
                setVideoError(true);
            });
        }
    }, []);

    // If no video provided or error, show gradient background
    if (!videoSrc || videoError) {
        return (
            <div
                className="fixed top-0 left-0 w-full h-screen z-0"
                style={{
                    background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%)',
                }}
            />
        );
    }

    return (
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
            {/* Video Element */}
            <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                onError={() => setVideoError(true)}
            >
                <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Warm Tint Overlay */}
            <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                    background: 'linear-gradient(180deg, rgba(214, 194, 161, 0.05) 0%, rgba(17, 17, 17, 0.7) 100%)',
                }}
            />

            {/* Darkening Overlay for Text Readability */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
        </div>
    );
}
