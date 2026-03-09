require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_SSL } = process.env;

    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT || 4000,
            ssl: DB_SSL === 'true' ? {
                require: true,
                rejectUnauthorized: false
            } : undefined
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`✓ Database '${DB_NAME}' created or already exists.`);

        await connection.end();
    } catch (error) {
        console.error('✗ Failed to create database:', error);
        process.exit(1);
    }
}

createDatabase();
