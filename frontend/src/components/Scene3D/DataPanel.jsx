import { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

/**
 * Glass-like Floating Data Panel
 * Displays employee, customer, or invoice data with smooth animations
 */
export default function DataPanel({
    position = [0, 2, -5],
    data = null,
    dataType = 'car', // 'car', 'employee', 'customer', 'invoice'
    onClose,
    visible = true,
}) {
    const [panelRef, setPanelRef] = useState(null);

    useEffect(() => {
        if (panelRef && visible) {
            // Slide and fade in animation
            gsap.from(panelRef.position, {
                y: position[1] - 2,
                duration: 0.6,
                ease: 'power2.out',
            });

            gsap.from(panelRef.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.5,
                ease: 'back.out(1.7)',
            });
        }
    }, [panelRef, visible, position]);

    if (!visible || !data) return null;

    // Glass material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#1a1a1a'),
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        transparent: true,
        opacity: 0.4,
        thickness: 0.5,
    });

    const renderContent = () => {
        switch (dataType) {
            case 'car':
                return (
                    <>
                        <h3 className="text-xl font-bold text-bmw-blue mb-3">{data.Model}</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-400">IL No:</span> <span className="text-white">{data.IL_No || '—'}</span></p>
                            <p><span className="text-gray-400">Mod No:</span> <span className="text-white">{data.Mod_No || '—'}</span></p>
                            <p><span className="text-gray-400">Colour:</span> <span className="text-white capitalize">{data.Colour || '—'}</span></p>
                            <p><span className="text-gray-400">Year:</span> <span className="text-white">{data.Year || '—'}</span></p>
                            <p><span className="text-gray-400">Status:</span> <span className={`font-semibold ${data.status === 'sold' ? 'text-red-400' : 'text-green-400'}`}>{data.status}</span></p>
                        </div>
                    </>
                );
            case 'employee':
                return (
                    <>
                        <h3 className="text-xl font-bold text-bmw-blue mb-3">Employee Details</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-400">Name:</span> <span className="text-white">{data.Name}</span></p>
                            <p><span className="text-gray-400">Address:</span> <span className="text-white">{data.Address || '—'}</span></p>
                            {data.qualifications && data.qualifications.length > 0 && (
                                <div>
                                    <span className="text-gray-400">Qualifications:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {data.qualifications.map((q, i) => (
                                            <span key={i} className="bg-bmw-blue/20 text-bmw-blue text-xs px-2 py-0.5 rounded-full">
                                                {q.qualification}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                );
            case 'customer':
                return (
                    <>
                        <h3 className="text-xl font-bold text-bmw-blue mb-3">Customer Details</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-400">Name:</span> <span className="text-white">{data.Name}</span></p>
                            <p><span className="text-gray-400">Phone:</span> <span className="text-white">{data.Ph_No || '—'}</span></p>
                            <p><span className="text-gray-400">City:</span> <span className="text-white">{data.City || '—'}</span></p>
                            <p><span className="text-gray-400">Country:</span> <span className="text-white">{data.Country || '—'}</span></p>
                            <p><span className="text-gray-400">Address:</span> <span className="text-white">{data.Address || '—'}</span></p>
                        </div>
                    </>
                );
            case 'invoice':
                return (
                    <>
                        <h3 className="text-xl font-bold text-bmw-blue mb-3">Invoice Details</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-400">Invoice ID:</span> <span className="text-white">#{data.Invoice_ID}</span></p>
                            <p><span className="text-gray-400">Date:</span> <span className="text-white">{data.Date}</span></p>
                            <p><span className="text-gray-400">Amount:</span> <span className="text-white">₹{data.amount?.toLocaleString() || '—'}</span></p>
                            {data.employee && <p><span className="text-gray-400">Employee:</span> <span className="text-white">{data.employee.Name}</span></p>}
                            {data.car && <p><span className="text-gray-400">Car:</span> <span className="text-white">{data.car.Model}</span></p>}
                            {data.customer && <p><span className="text-gray-400">Customer:</span> <span className="text-white">{data.customer.Name}</span></p>}
                        </div>
                    </>
                );
            default:
                return <p className="text-white">No data available</p>;
        }
    };

    return (
        <group ref={setPanelRef} position={position}>
            {/* Glass Panel Backing */}
            <mesh material={glassMaterial} castShadow>
                <boxGeometry args={[5, 4, 0.1]} />
            </mesh>

            {/* Panel Border */}
            <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[5.1, 4.1, 0.02]} />
                <meshStandardMaterial
                    color="#1c69d4"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#1c69d4"
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* HTML Content Overlay */}
            <Html
                position={[0, 0, 0.12]}
                center
                transform
                distanceFactor={2}
                style={{
                    width: '400px',
                    pointerEvents: 'auto',
                }}
            >
                <div className="glass rounded-xl p-6 relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 
                       hover:bg-red-500 transition-colors duration-200
                       flex items-center justify-center text-white text-lg"
                    >
                        ×
                    </button>

                    {/* Data Content */}
                    {renderContent()}
                </div>
            </Html>

            {/* Accent glow */}
            <pointLight position={[0, 0, 1]} intensity={0.5} color="#1c69d4" distance={3} />
        </group>
    );
}
