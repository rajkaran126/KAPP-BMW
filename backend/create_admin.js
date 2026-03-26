const sequelize = require('./config/database');
const User = require('./models/User');

async function createAdmin() {
    try {
        await sequelize.authenticate();
        console.log('✓ Connected to Database');

        // Create Users table only if it doesn't exist (safe for TiDB Cloud)
        // Using { force: false } = CREATE TABLE IF NOT EXISTS — no ALTER needed
        await User.sync({ force: false });
        console.log('✓ Users table ready');

        const admin = await User.findOne({ where: { username: 'karan' } });
        if (admin) {
            console.log('Admin user already exists.');
        } else {
            await User.create({
                username: 'karan',
                password: 'karan123',
                name: 'Karan',
                role: 'Admin'
            });
            console.log('✓ Admin user "karan" created successfully.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
}

createAdmin();
