import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * BMW Model Component
 * Renders a BMW vehicle with metallic paint shader
 * Falls back to placeholder geometry if model not available
 */
export default function BMWModel({
    modelPath,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    color = '#1a1a1a',
    onClick,
    autoRotate = false,
    ...props
}) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Auto rotation animation
    useFrame((state, delta) => {
        if (meshRef.current && autoRotate) {
            meshRef.current.rotation.y += delta * 0.3;
        }

        // Subtle hover effect
        if (meshRef.current && hovered) {
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
        }
    });

    // Metallic car paint material
    const carMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.9,
        roughness: 0.25,
        envMapIntensity: 1.5,
    });

    // Try to load GLTF model, fallback to placeholder
    let model = null;
    try {
        if (modelPath) {
            const gltf = useGLTF(modelPath);
            model = gltf.scene;
        }
    } catch (error) {
        console.log('Using placeholder geometry for BMW model');
    }

    return (
        <group
            ref={meshRef}
            position={position}
            rotation={rotation}
            scale={scale}
            onClick={onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            {...props}
        >
            {model ? (
                // Use loaded GLTF model
                <primitive object={model} />
            ) : (
                // Placeholder BMW-like geometry
                <group>
                    {/* Car Body */}
                    <mesh castShadow receiveShadow material={carMaterial}>
                        <boxGeometry args={[2, 0.8, 4]} />
                    </mesh>

                    {/* Car Top/Cabin */}
                    <mesh
                        position={[0, 0.6, -0.3]}
                        castShadow
                        receiveShadow
                        material={carMaterial}
                    >
                        <boxGeometry args={[1.6, 0.6, 2]} />
                    </mesh>

                    {/* Wheels */}
                    <mesh position={[-0.8, -0.5, 1.2]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
                        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.3} />
                    </mesh>
                    <mesh position={[0.8, -0.5, 1.2]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
                        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.3} />
                    </mesh>
                    <mesh position={[-0.8, -0.5, -1.2]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
                        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.3} />
                    </mesh>
                    <mesh position={[0.8, -0.5, -1.2]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
                        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.3} />
                    </mesh>

                    {/* Headlights */}
                    <mesh position={[-0.6, 0.1, 2.1]}>
                        <boxGeometry args={[0.3, 0.2, 0.1]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
                    </mesh>
                    <mesh position={[0.6, 0.1, 2.1]}>
                        <boxGeometry args={[0.3, 0.2, 0.1]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
                    </mesh>
                </group>
            )}
        </group>
    );
}
