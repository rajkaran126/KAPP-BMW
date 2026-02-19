// BMW Models Data
export const BMW_MODELS = [
    {
        id: 1,
        name: 'BMW 3 Series',
        category: 'sedan',
        description: 'Compact luxury sedan with sporty handling',
        price: 42000,
        image: '/images/cars/bmw-3-series.jpg'
    },
    {
        id: 2,
        name: 'BMW 5 Series',
        category: 'sedan',
        description: 'Executive sedan with advanced technology',
        price: 55000,
        color: '#2c2c2c'
    },
    {
        id: 3,
        name: 'BMW 7 Series',
        category: 'luxury',
        description: 'Flagship luxury sedan with ultimate comfort',
        price: 87000,
        image: '/images/cars/bmw-7-series.jpg'
    },
    {
        id: 4,
        name: 'BMW X1',
        category: 'suv',
        description: 'Compact luxury SUV for urban adventures',
        price: 38000,
        color: '#ffffff'
    },
    {
        id: 5,
        name: 'BMW X3',
        category: 'suv',
        description: 'Versatile midsize SUV with premium features',
        price: 47000,
        image: '/images/cars/bmw-x3.jpg'
    },
    {
        id: 6,
        name: 'BMW X5',
        category: 'suv',
        description: 'Luxury midsize SAV with powerful performance',
        price: 62000,
        image: '/images/cars/bmw-x5.jpg'
    },
    {
        id: 7,
        name: 'BMW X7',
        category: 'luxury-suv',
        description: 'Full-size luxury SUV with commanding presence',
        price: 76000,
        image: '/images/cars/bmw-x7.jpg'
    },
    {
        id: 8,
        name: 'BMW M3',
        category: 'performance',
        description: 'High-performance sedan with track capability',
        price: 73000,
        image: '/images/cars/bmw-m3.jpg'
    },
    {
        id: 9,
        name: 'BMW M4',
        category: 'performance',
        description: 'Performance coupe with racing heritage',
        price: 75000,
        color: '#1c69d4'
    },
    {
        id: 10,
        name: 'BMW M5',
        category: 'performance',
        description: 'Ultimate performance sedan',
        price: 107000,
        color: '#8aa4ff',
        color: '#8aa4ff',
        image: '/images/cars/bmw-m5-new.jpg'
    },
    {
        id: 11,
        name: 'BMW i4',
        category: 'electric',
        description: 'Electric gran coupe with dynamic performance',
        price: 56000,
        image: '/images/cars/bmw-i4.jpg'
    },
    {
        id: 12,
        name: 'BMW i7',
        category: 'electric',
        description: 'Electric luxury sedan with cutting-edge technology',
        price: 106000,
        color: '#ffffff'
    },
    {
        id: 13,
        name: 'BMW iX',
        category: 'electric-suv',
        description: 'Electric luxury SAV with sustainable innovation',
        price: 88000,
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
