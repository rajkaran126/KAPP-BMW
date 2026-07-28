import { useState } from 'react';
import { BMW_MODELS } from '../../utils/bmwModels';

/**
 * Simplified Car Card - No 3D, just HTML/CSS
 */
function CarCard({ model, onClick, onHover, isHovered }) {
    return (
        <div
            className={`relative group cursor-pointer transition-all duration-300
                  ${isHovered ? 'scale-105 z-10' : 'scale-100'}`}
            onClick={() => onClick(model)}
            onMouseEnter={() => onHover(model.id)}
            onMouseLeave={() => onHover(null)}
        >
            {/* Card Container */}
            <div className="glass-light rounded-2xl overflow-hidden border border-white/20 
                      hover:border-bmw-blue/50 transition-all duration-300
                      shadow-xl hover:shadow-2xl hover:shadow-bmw-blue/20">

                {/* Car Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    {/* Background Image */}
                    <img
                        src={model.image || '/images/cars/placeholder.jpg'}
                        alt={model.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback to gradient if image not found
                            e.target.style.display = 'none';
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Badge */}
                    {model.category.includes('electric') && (
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                            Electric
                        </div>
                    )}
                    {model.category === 'performance' && (
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                            M Performance
                        </div>
                    )}
                </div>

                {/* Car Info */}
                <div className="p-5 space-y-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{model.name}</h3>
                        <p className="text-gray-400 text-sm line-clamp-1">{model.description}</p>
                    </div>

                    {/* Price */}
                    <div className="border-t border-white/10 pt-3">
                        <p className="text-bmw-blue text-2xl font-bold">
                            {model.price >= 10000000 ? `₹${(model.price / 10000000).toFixed(2)} Cr` : `₹${(model.price / 100000).toFixed(2)} L`}
                        </p>
                        <p className="text-gray-500 text-xs">Ex-Showroom Starting Price</p>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs mb-1">Fuel Type</span>
                            <span className="text-white text-sm font-semibold">
                                {model.fuelType || (model.category.includes('electric') ? 'Electric' : 'Petrol')}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs mb-1">Transmission</span>
                            <span className="text-white text-sm font-semibold">
                                {model.transmission || 'Automatic'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs mb-1">Engine</span>
                            <span className="text-white text-sm font-semibold">
                                {model.engine || '2.0L'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs mb-1">Power</span>
                            <span className="text-white text-sm font-semibold">
                                {model.power || '250 HP'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs mb-1">Seating</span>
                            <span className="text-white text-sm font-semibold">
                                {model.seats || '5'} Seats
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs mb-1">
                                {model.category.includes('electric') ? 'Range' : 'Mileage'}
                            </span>
                            <span className="text-white text-sm font-semibold">
                                {model.range || model.mileage || '400 km'}
                            </span>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-2 pt-2">
                        <button className="flex-1 py-2 rounded-lg bg-bmw-blue hover:bg-bmw-blue-dark 
                             text-white text-sm font-semibold transition-colors">
                            View Details
                        </button>
                        <button className="flex-1 py-2 rounded-lg border border-bmw-blue text-bmw-blue 
                             hover:bg-bmw-blue hover:text-white text-sm font-semibold transition-colors">
                            Test Drive
                        </button>
                    </div>
                </div>
            </div>

            {/* Hover Glow */}
            {isHovered && (
                <div className="absolute inset-0 -z-10 blur-xl bg-bmw-blue/30 rounded-2xl" />
            )}
        </div>
    );
}

/**
 * Car Display Grid - Simplified Version (No 3D)
 */
export function CarDisplayGrid({ onCarClick }) {
    const [hoveredCar, setHoveredCar] = useState(null);
    const featuredModels = BMW_MODELS;

    return (
        <div className="relative py-20 px-8 bg-graphite">
            {/* Section Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <h2 className="text-4xl font-bold text-white mb-3">
                    Our BMW Collection
                </h2>
                <p className="text-gray-400 text-lg">
                    Explore our premium selection of BMW vehicles
                </p>
            </div>

            {/* Car Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredModels.map((model) => (
                    <CarCard
                        key={model.id}
                        model={model}
                        onClick={onCarClick}
                        onHover={setHoveredCar}
                        isHovered={hoveredCar === model.id}
                    />
                ))}
            </div>
        </div>

    );
}

export default CarDisplayGrid;
