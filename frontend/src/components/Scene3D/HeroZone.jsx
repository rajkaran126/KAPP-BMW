import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import BMWModel from '../BMW/BMWModel';
import { gsap } from 'gsap';

/**
 * Hero Zone - Main showcase area with featured BMW
 * Includes cinematic camera intro animation
 */
export default function HeroZone({ isActive = true }) {
    const groupRef = useRef();
    const carRef = useRef();

    // Cinematic intro animation
    useEffect(() => {
        if (isActive && groupRef.current) {
            // Animate hero section entrance
            gsap.from(groupRef.current.position, {
                y: -5,
                duration: 2,
                ease: 'power3.out',
            });

            gsap.from(groupRef.current.rotation, {
                y: Math.PI * 2,
                duration: 2.5,
                ease: 'power2.out',
            });
        }
    }, [isActive]);

    // Subtle floating animation
    useFrame((state) => {
        if (carRef.current) {
            carRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            carRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* Featured BMW M5 */}
            <BMWModel
                ref={carRef}
                position={[0, 0, 0]}
                scale={1.2}
                color="#8aa4ff" // BMW Blue
                autoRotate={false}
            />

            {/* Accent lights around hero car */}
            <pointLight position={[3, 2, 3]} intensity={0.5} color="#1c69d4" />
            <pointLight position={[-3, 2, -3]} intensity={0.5} color="#d6c2a1" />
        </group>
    );
}
