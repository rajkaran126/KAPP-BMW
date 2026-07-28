// BMW Models Data (India Showroom Pricing in ₹)
export const BMW_MODELS = [
    {
        id: 1,
        name: 'BMW 3 Series',
        category: 'sedan',
        description: 'Compact luxury sedan with sporty handling',
        price: 5500000, // ₹55 Lakhs
        image: '/images/cars/bmw-3-series.jpg'
    },
    {
        id: 2,
        name: 'BMW 5 Series',
        category: 'sedan',
        description: 'Executive sedan with advanced technology',
        price: 7800000, // ₹78 Lakhs
        color: '#2c2c2c'
    },
    {
        id: 3,
        name: 'BMW 7 Series',
        category: 'luxury',
        description: 'Flagship luxury sedan with ultimate comfort',
        price: 18500000, // ₹1.85 Crores
        image: '/images/cars/bmw-7-series.jpg'
    },
    {
        id: 4,
        name: 'BMW X1',
        category: 'suv',
        description: 'Compact luxury SUV for urban adventures',
        price: 4900000, // ₹49 Lakhs
        color: '#ffffff'
    },
    {
        id: 5,
        name: 'BMW X3',
        category: 'suv',
        description: 'Versatile midsize SUV with premium features',
        price: 6800000, // ₹68 Lakhs
        image: '/images/cars/bmw-x3.jpg'
    },
    {
        id: 6,
        name: 'BMW X5',
        category: 'suv',
        description: 'Luxury midsize SAV with powerful performance',
        price: 9800000, // ₹98 Lakhs
        image: '/images/cars/bmw-x5.jpg'
    },
    {
        id: 7,
        name: 'BMW X7',
        category: 'luxury-suv',
        description: 'Full-size luxury SUV with commanding presence',
        price: 13000000, // ₹1.30 Crores
        image: '/images/cars/bmw-x7.jpg'
    },
    {
        id: 8,
        name: 'BMW M3 Competition',
        category: 'performance',
        description: 'High-performance sedan with track-ready capability',
        price: 14500000, // ₹1.45 Crores
        image: '/images/cars/bmw-m3.jpg'
    },
    {
        id: 9,
        name: 'BMW M5 CS',
        category: 'performance',
        description: 'Ultimate performance sedan with V8 power',
        price: 19900000, // ₹1.99 Crores
        image: '/images/cars/bmw-m5.jpg'
    },
    {
        id: 10,
        name: 'BMW i4 Electric',
        category: 'electric',
        description: 'All-electric Gran Coupe with zero emissions',
        price: 7200000, // ₹72 Lakhs
        image: '/images/cars/bmw-i4.jpg'
    },
    {
        id: 11,
        name: 'BMW i7 Electric',
        category: 'electric',
        description: 'All-electric flagship sedan with futuristic luxury',
        price: 21500000, // ₹2.15 Crores
        image: '/images/cars/bmw-i7.jpg'
    },
    {
        id: 12,
        name: 'BMW iX Electric',
        category: 'electric',
        description: 'SAV of the future with sustainable luxury',
        price: 12200000, // ₹1.22 Crores
        image: '/images/cars/bmw-ix.jpg'
    },
    {
        id: 13,
        name: 'BMW iX',
        category: 'electric-suv',
        description: 'Electric luxury SAV with sustainable innovation',
        price: 12200000, // ₹1.22 Crores
        image: '/images/cars/bmw-ix.jpg'
    }
];

export const getCategoryModels = (category) => {
    return BMW_MODELS.filter(model => model.category === category);
};

export const getModelById = (id) => {
    return BMW_MODELS.find(model => model.id === id);
};

export const getModelByName = (name) => {
    return BMW_MODELS.find(model => model.name === name);
};
