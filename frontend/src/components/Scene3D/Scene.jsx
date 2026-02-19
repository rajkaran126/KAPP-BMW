import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState } from 'react';
import Lighting from './Lighting';
import HeroZone from './HeroZone';
import CarDisplayZone from './CarDisplayZone';
import PromoPanel from './PromoPanel';
import DataPanel from './DataPanel';

/**
 * Main 3D Scene Component
 * Orchestrates all 3D elements with scroll-based navigation
 */
export default function Scene({ scrollProgress = 0, onCarClick }) {
    const [selectedCar, setSelectedCar] = useState(null);
    const [showDataPanel, setShowDataPanel] = useState(false);

    const handleCarClick = (car) => {
        setSelectedCar(car);
        setShowDataPanel(true);
        if (onCarClick) onCarClick(car);
    };

    const handleClosePanel = () => {
        setShowDataPanel(false);
        setSelectedCar(null);
    };

    return (
        <Canvas
            shadows
            className="canvas-container"
            gl={{
                antialias: true,
                alpha: false,
            }}
            style={{ background: '#111111' }}
        >
            {/* Camera Setup */}
            <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={50} />

            {/* Orbit Controls for development (can be disabled for production) */}
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={5}
                maxDistance={20}
                maxPolarAngle={Math.PI / 2}
            />

            {/* Lighting System */}
            <Suspense fallback={null}>
                <Lighting scrollProgress={scrollProgress} />
            </Suspense>

            {/* Hero Zone - Main featured car */}
            <Suspense fallback={null}>
                <HeroZone isActive={scrollProgress < 0.3} />
            </Suspense>

            {/* Promo Panel - Marketing content */}
            <Suspense fallback={null}>
                <PromoPanel
                    position={[8, 2, -5]}
                    rotation={[0, -Math.PI / 6, 0]}
                    title="Premium BMW Collection"
                    description="Experience the finest German engineering with our exclusive BMW lineup. From high-performance M Series to sustainable electric vehicles."
                    ctaText="View Collection"
                    onCtaClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                />
            </Suspense>

            {/* Car Display Zone - Interactive car grid */}
            <Suspense fallback={null}>
                <CarDisplayZone
                    position={[0, 0, -15]}
                    onCarClick={handleCarClick}
                />
            </Suspense>

            {/* Data Panel - Shows car details when clicked */}
            {showDataPanel && selectedCar && (
                <Suspense fallback={null}>
                    <DataPanel
                        position={[0, 3, -8]}
                        data={selectedCar}
                        dataType="car"
                        onClose={handleClosePanel}
                        visible={showDataPanel}
                    />
                </Suspense>
            )}

            {/* Ground Plane (optional) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    metalness={0.2}
                    roughness={0.8}
                />
            </mesh>
        </Canvas>
    );
}
