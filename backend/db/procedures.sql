-- ============================================================
-- KAPP-BMW Sales Management — Stored Procedures with Cursors
-- ============================================================
-- Run this file after triggers.sql to install all procedures.
-- Usage: node backend/db/install_procedures.js
-- ============================================================

USE kapp_bmw;

-- ─── Procedure 1: Employee Sales Report (uses CURSOR) ────────────────────────
-- Iterates through all employees using a cursor and computes:
--   - Total invoices handled
--   - Total sales amount
--   - Number of unique cars sold
-- Results are stored in SalesReport table for retrieval.
DROP TABLE IF EXISTS SalesReport;
CREATE TABLE SalesReport (
    report_id     INT AUTO_INCREMENT PRIMARY KEY,
    EmpID         INT,
    EmployeeName  VARCHAR(255),
    total_invoices INT DEFAULT 0,
    total_amount  DECIMAL(14, 2) DEFAULT 0.00,
    cars_sold     INT DEFAULT 0,
    generated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP PROCEDURE IF EXISTS GenerateEmployeeSalesReport;

DELIMITER $$
CREATE PROCEDURE GenerateEmployeeSalesReport()
BEGIN
    -- Cursor variables
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_emp_id INT;
    DECLARE v_emp_name VARCHAR(255);
    DECLARE v_total_invoices INT;
    DECLARE v_total_amount DECIMAL(14, 2);
    DECLARE v_cars_sold INT;

    -- Declare cursor over all employees
    DECLARE emp_cursor CURSOR FOR
        SELECT EmpID, Name FROM Employees;

    -- Handler: set done=TRUE when no more rows
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Clear previous report
    DELETE FROM SalesReport;

    -- Open cursor and iterate
    OPEN emp_cursor;

    read_loop: LOOP
        FETCH emp_cursor INTO v_emp_id, v_emp_name;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Aggregate invoice data for this employee
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

        -- Insert into report table
        INSERT INTO SalesReport (EmpID, EmployeeName, total_invoices, total_amount, cars_sold)
        VALUES (v_emp_id, v_emp_name, v_total_invoices, v_total_amount, v_cars_sold);

    END LOOP;

    CLOSE emp_cursor;

    -- Return the report
    SELECT * FROM SalesReport ORDER BY total_amount DESC;
END$$
DELIMITER ;


-- ─── Procedure 2: Available Cars Summary (uses CURSOR) ────────────────────────
-- Iterates through all available cars using a cursor and builds a summary
-- including how many employees are associated (via SELLS) with each car.
DROP PROCEDURE IF EXISTS GetAvailableCarsSummary;

DELIMITER $$
CREATE PROCEDURE GetAvailableCarsSummary()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_car_id INT;
    DECLARE v_model VARCHAR(100);
    DECLARE v_colour VARCHAR(50);
    DECLARE v_year INT;
    DECLARE v_il_no VARCHAR(100);
    DECLARE v_seller_count INT;

    -- Cursor over available cars only
    DECLARE car_cursor CURSOR FOR
        SELECT Car_ID, Model, Colour, Year, IL_No
        FROM Cars
        WHERE status = 'available'
        ORDER BY Year DESC;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Temp result set
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

        -- Count how many employees have sold/are associated with this car
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
END$$
DELIMITER ;


-- ─── Procedure 3: Customer Purchase History (uses CURSOR) ─────────────────────
-- Given a customer ID, uses a cursor to iterate their invoices
-- and return a detailed purchase history with car and employee info.
DROP PROCEDURE IF EXISTS GetCustomerPurchaseHistory;

DELIMITER $$
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
        Invoice_ID   INT,
        Date         DATE,
        amount       DECIMAL(12,2),
        Car_Model    VARCHAR(100),
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
END$$
DELIMITER ;
