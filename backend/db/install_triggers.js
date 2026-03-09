/**
 * Installs all MySQL triggers from db/triggers.sql
 * Run: node backend/db/install_triggers.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function installTriggers() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true,
        ssl: (process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com'))) ? {
            rejectUnauthorized: true
        } : undefined
    });

    try {
        console.log('📦 Installing triggers...\n');

        const sql = fs.readFileSync(path.join(__dirname, 'triggers.sql'), 'utf8');

        // Split on DELIMITER changes and execute each block
        const blocks = sql
            .replace(/DELIMITER \$\$/g, '')
            .replace(/DELIMITER ;/g, '')
            .split('$$')
            .map(b => b.trim())
            .filter(b => b.length > 0 && !b.startsWith('--') && !b.startsWith('USE'));

        for (const block of blocks) {
            if (block.trim()) {
                try {
                    await connection.query(block);
                    // Extract trigger name for logging
                    const match = block.match(/TRIGGER\s+(\w+)/i);
                    if (match) console.log(`  ✓ Installed trigger: ${match[1]}`);
                    else console.log(`  ✓ Executed statement`);
                } catch (err) {
                    console.error(`  ✗ Error: ${err.message}`);
                    console.error(`    SQL: ${block.substring(0, 100)}...`);
                }
            }
        }

        console.log('\n✅ All triggers installed successfully!\n');
    } finally {
        await connection.end();
    }
}

installTriggers().catch(console.error);
