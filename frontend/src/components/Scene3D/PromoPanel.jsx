import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Floating 3D Promo Panel
 * Marketing content displayed in 3D space with warm beige/brown accents
 */
export default function PromoPanel({
    position = [8, 2, -8],
    rotation = [0, -Math.PI / 4, 0],
    title = "Premium BMW Experience",
    description = "Discover the ultimate driving machine",
    ctaText = "Explore Now",
    onCtaClick,
}) {
    // Beige/brown material for panel
    const panelMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d6c2a1'),
        metalness: 0.3,
        roughness: 0.6,
        emissive: new THREE.Color('#8b7355'),
        emissiveIntensity: 0.1,
    });

    return (
        <group position={position} rotation={rotation}>
            {/* 3D Panel Backing */}
            <mesh material={panelMaterial} castShadow>
                <boxGeometry args={[4, 3, 0.2]} />
            </mesh>

            {/* Panel Frame */}
            <mesh position={[0, 0, 0.11]}>
                <boxGeometry args={[4.1, 3.1, 0.05]} />
                <meshStandardMaterial color="#8b7355" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* HTML Overlay Content */}
            <Html
                position={[0, 0, 0.15]}
                center
                transform
                distanceFactor={1.5}
                style={{
                    width: '350px',
                    pointerEvents: 'auto',
                }}
            >
                <div className="glass-light rounded-xl p-6 text-center">
                    <h2 className="text-2xl font-bold mb-3 text-warm-beige">
                        {title}
                    </h2>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                        {description}
                    </p>
                    <button
                        onClick={onCtaClick}
                        className="px-6 py-2 rounded-lg font-semibold transition-all duration-300
                       bg-gradient-warm text-white hover:scale-105 active:scale-95
                       shadow-lg"
                    >
                        {ctaText}
                    </button>
                </div>
            </Html>

            {/* Accent light */}
            <spotLight
                position={[0, 2, 2]}
                angle={0.5}
                penumbra={0.5}
                intensity={0.5}
                color="#d6c2a1"
                castShadow={false}
            />
        </group>
    );
}
