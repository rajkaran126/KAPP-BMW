const sequelize = require('./config/database');
const User = require('./models/User');

async function createAdmin() {
    try {
        await sequelize.authenticate();
        console.log('✓ Connected to Database');

        const admin = await User.findOne({ where: { username: 'karan' } });
        if (admin) {
            console.log('Admin user already exists.');
        } else {
            await User.create({
                username: 'karan',
                password: 'karan123', // Ideally hashed
                name: 'Karan',
                role: 'Admin'
            });
            console.log('✓ Admin user "karan" created successfully.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
