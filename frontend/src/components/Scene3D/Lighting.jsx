import { Environment, ContactShadows } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

/**
 * Professional BMW Showroom Lighting System
 * Implements studio-quality lighting matching luxury showroom standards
 */
export default function Lighting({ scrollProgress = 0 }) {
    const { gl, scene } = useThree();

    useEffect(() => {
        // Configure tone mapping for photorealistic rendering
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;

        // Enable shadows
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }, [gl]);

    // Dynamic rim light intensity based on scroll
    const rimLightIntensity = 1.2 + (scrollProgress * 0.3);
    const ambientIntensity = Math.max(0.15, 0.25 - (scrollProgress * 0.1));

    return (
        <>
            {/* Ambient Light - prevents full darkness */}
            <ambientLight intensity={ambientIntensity} color="#ffffff" />

            {/* Key Light - Main hero light from front-top angle */}
            <directionalLight
                position={[5, 8, 5]}
                intensity={1.8}
                color="#ffffff"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
                shadow-bias={-0.0001}
            />

            {/* Rim Light - BMW blue edge separation from behind */}
            <directionalLight
                position={[-5, 4, -5]}
                intensity={rimLightIntensity}
                color="#8aa4ff" // BMW blue tone
            />

            {/* Fill Light - balances harsh shadows */}
            <directionalLight
                position={[-3, 3, 3]}
                intensity={0.6}
                color="#ffffff"
            />

            {/* Promo Section Warm Spotlight */}
            <spotLight
                position={[0, 8, -10]}
                intensity={0.4}
                angle={0.6}
                penumbra={0.5}
                color="#d6c2a1" // Warm beige
                castShadow={false}
            />

            {/* HDRI Environment - studio showroom */}
            <Environment
                preset="studio"
                background={false}
                environmentIntensity={0.4}
            />

            {/* Contact Shadows - ground shadows under vehicles */}
            <ContactShadows
                position={[0, -0.8, 0]}
                opacity={0.5}
                scale={15}
                blur={2.5}
                far={4}
            />

            {/* Scene Fog for depth */}
            <fog attach="fog" args={['#111111', 20, 50]} />
        </>
    );
}
