/**
 * Installs all MySQL stored procedures (with cursors) directly via mysql2.
 * Each procedure is defined inline to avoid SQL parsing issues.
 * Run: node backend/db/install_procedures.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const procedures = [
    {
        name: 'SalesReport table',
        sql: `
            CREATE TABLE IF NOT EXISTS SalesReport (
                report_id     INT AUTO_INCREMENT PRIMARY KEY,
                EmpID         INT,
                EmployeeName  VARCHAR(255),
                total_invoices INT DEFAULT 0,
                total_amount  DECIMAL(14, 2) DEFAULT 0.00,
                cars_sold     INT DEFAULT 0,
                generated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `
    },
    {
        name: 'DROP GenerateEmployeeSalesReport',
        sql: `DROP PROCEDURE IF EXISTS GenerateEmployeeSalesReport`
    },
    {
        name: 'GenerateEmployeeSalesReport (cursor over employees)',
        sql: `
            CREATE PROCEDURE GenerateEmployeeSalesReport()
            BEGIN
                DECLARE done INT DEFAULT FALSE;
                DECLARE v_emp_id INT;
                DECLARE v_emp_name VARCHAR(255);
                DECLARE v_total_invoices INT;
                DECLARE v_total_amount DECIMAL(14, 2);
                DECLARE v_cars_sold INT;

                DECLARE emp_cursor CURSOR FOR
                    SELECT EmpID, Name FROM Employees;

                DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

                DELETE FROM SalesReport;

                OPEN emp_cursor;

                read_loop: LOOP
                    FETCH emp_cursor INTO v_emp_id, v_emp_name;
                    IF done THEN
                        LEAVE read_loop;
                    END IF;

                    SELECT
                        COUNT(*),
                        COALESCE(SUM(amount), 0),
                        COUNT(DISTINCT Car_ID)
                    INTO
                        v_total_invoices,
                        v_total_amount,
                        v_cars_sold
                    FROM Invoices
                    WHERE EmpID = v_emp_id;

                    INSERT INTO SalesReport (EmpID, EmployeeName, total_invoices, total_amount, cars_sold)
                    VALUES (v_emp_id, v_emp_name, v_total_invoices, v_total_amount, v_cars_sold);
                END LOOP;

                CLOSE emp_cursor;

                SELECT * FROM SalesReport ORDER BY total_amount DESC;
            END
        `
    },
    {
        name: 'DROP GetAvailableCarsSummary',
        sql: `DROP PROCEDURE IF EXISTS GetAvailableCarsSummary`
    },
    {
        name: 'GetAvailableCarsSummary (cursor over available cars)',
        sql: `
            CREATE PROCEDURE GetAvailableCarsSummary()
            BEGIN
                DECLARE done INT DEFAULT FALSE;
                DECLARE v_car_id INT;
                DECLARE v_model VARCHAR(100);
                DECLARE v_colour VARCHAR(50);
                DECLARE v_year INT;
                DECLARE v_il_no VARCHAR(100);
                DECLARE v_seller_count INT;

                DECLARE car_cursor CURSOR FOR
                    SELECT Car_ID, Model, Colour, Year, IL_No
                    FROM Cars
                    WHERE status = 'available'
                    ORDER BY Year DESC;

                DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

                DROP TEMPORARY TABLE IF EXISTS AvailableCarsTemp;
                CREATE TEMPORARY TABLE AvailableCarsTemp (
                    Car_ID       INT,
                    Model        VARCHAR(100),
                    Colour       VARCHAR(50),
                    Year         INT,
                    IL_No        VARCHAR(100),
                    seller_count INT
                );

                OPEN car_cursor;

                car_loop: LOOP
                    FETCH car_cursor INTO v_car_id, v_model, v_colour, v_year, v_il_no;
                    IF done THEN
                        LEAVE car_loop;
                    END IF;

                    SELECT COUNT(*) INTO v_seller_count
                    FROM EmployeeCar
                    WHERE Car_ID = v_car_id;

                    INSERT INTO AvailableCarsTemp VALUES (
                        v_car_id, v_model, v_colour, v_year, v_il_no, v_seller_count
                    );
                END LOOP;

                CLOSE car_cursor;

                SELECT * FROM AvailableCarsTemp;
                DROP TEMPORARY TABLE IF EXISTS AvailableCarsTemp;
            END
        `
    },
    {
        name: 'DROP GetCustomerPurchaseHistory',
        sql: `DROP PROCEDURE IF EXISTS GetCustomerPurchaseHistory`
    },
    {
        name: 'GetCustomerPurchaseHistory (cursor over customer invoices)',
        sql: `
            CREATE PROCEDURE GetCustomerPurchaseHistory(IN p_cus_id INT)
            BEGIN
                DECLARE done INT DEFAULT FALSE;
                DECLARE v_invoice_id INT;
                DECLARE v_date DATE;
                DECLARE v_amount DECIMAL(12,2);
                DECLARE v_car_id INT;
                DECLARE v_emp_id INT;
                DECLARE v_car_model VARCHAR(100);
                DECLARE v_emp_name VARCHAR(255);

                DECLARE inv_cursor CURSOR FOR
                    SELECT Invoice_ID, Date, amount, Car_ID, EmpID
                    FROM Invoices
                    WHERE Cus_ID = p_cus_id
                    ORDER BY Date DESC;

                DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

                DROP TEMPORARY TABLE IF EXISTS PurchaseHistoryTemp;
                CREATE TEMPORARY TABLE PurchaseHistoryTemp (
                    Invoice_ID    INT,
                    Date          DATE,
                    amount        DECIMAL(12,2),
                    Car_Model     VARCHAR(100),
                    Employee_Name VARCHAR(255)
                );

                OPEN inv_cursor;

                inv_loop: LOOP
                    FETCH inv_cursor INTO v_invoice_id, v_date, v_amount, v_car_id, v_emp_id;
                    IF done THEN
                        LEAVE inv_loop;
                    END IF;

                    SELECT Model INTO v_car_model FROM Cars WHERE Car_ID = v_car_id;
                    SELECT Name  INTO v_emp_name  FROM Employees WHERE EmpID = v_emp_id;

                    INSERT INTO PurchaseHistoryTemp VALUES (
                        v_invoice_id, v_date, v_amount, v_car_model, v_emp_name
                    );
                END LOOP;

                CLOSE inv_cursor;

                SELECT * FROM PurchaseHistoryTemp;
                DROP TEMPORARY TABLE IF EXISTS PurchaseHistoryTemp;
            END
        `
    }
];

async function installProcedures() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: (process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com'))) ? {
            rejectUnauthorized: true
        } : undefined
    });

    try {
        console.log('📦 Installing stored procedures (with cursors)...\n');

        for (const proc of procedures) {
            try {
                await connection.query(proc.sql);
                console.log(`  ✓ ${proc.name}`);
            } catch (err) {
                console.error(`  ✗ ${proc.name}: ${err.message}`);
            }
        }

        console.log('\n✅ All stored procedures installed successfully!\n');
    } finally {
        await connection.end();
    }
}

installProcedures().catch(console.error);
