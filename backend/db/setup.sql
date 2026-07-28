-- ============================================================
-- KAPP-BMW Sales Management — Full Database Setup Script
-- ============================================================
-- Run this in MySQL Workbench or MySQL CLI to create the
-- database and all tables from scratch.
--
-- Usage: SOURCE /path/to/setup.sql;
--   OR:  Open in MySQL Workbench and Execute All (Ctrl+Shift+Enter)
-- ============================================================

-- Step 1: Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS kapp_bmw
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE kapp_bmw;

-- ─── Step 2: Drop existing tables (in FK-safe order) ───────────────────────────
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS InvoiceLogs;
DROP TABLE IF EXISTS Invoices;
DROP TABLE IF EXISTS EmployeeCar;
DROP TABLE IF EXISTS EmployeeQualifications;
DROP TABLE IF EXISTS Cars;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Users;

SET FOREIGN_KEY_CHECKS = 1;

-- ─── Step 3: Create Tables ─────────────────────────────────────────────────────

-- Users (for authentication)
CREATE TABLE Users (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    username     VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    role         ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
    createdAt    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees
CREATE TABLE Employees (
    EmpID        INT AUTO_INCREMENT PRIMARY KEY,
    Name         VARCHAR(255) NOT NULL,
    Address      TEXT,
    designation  VARCHAR(255),
    createdAt    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employee Qualifications (multi-valued attribute)
CREATE TABLE EmployeeQualifications (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    EmpID         INT NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    CONSTRAINT fk_empqualif_employee
        FOREIGN KEY (EmpID) REFERENCES Employees(EmpID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Cars / Inventory
CREATE TABLE Cars (
    Car_ID   INT AUTO_INCREMENT PRIMARY KEY,
    IL_No    VARCHAR(100) COMMENT 'Insurance/License Number',
    Mod_No   VARCHAR(100) COMMENT 'Model Number',
    Model    VARCHAR(100) NOT NULL,
    Colour   VARCHAR(50),
    Year     INT,
    status   ENUM('available', 'sold') NOT NULL DEFAULT 'available',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customers
CREATE TABLE Customers (
    Cus_ID    INT AUTO_INCREMENT PRIMARY KEY,
    Name      VARCHAR(255) NOT NULL,
    Ph_No     VARCHAR(50),
    Address   TEXT,
    City      VARCHAR(100),
    Country   VARCHAR(100),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Invoices (sale records)
CREATE TABLE Invoices (
    Invoice_ID INT AUTO_INCREMENT PRIMARY KEY,
    Date       DATE NOT NULL DEFAULT (CURDATE()),
    amount     DECIMAL(12,2) COMMENT 'Sale amount',
    EmpID      INT NOT NULL,
    Car_ID     INT NOT NULL,
    Cus_ID     INT NOT NULL,
    createdAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_invoice_employee FOREIGN KEY (EmpID) REFERENCES Employees(EmpID),
    CONSTRAINT fk_invoice_car      FOREIGN KEY (Car_ID) REFERENCES Cars(Car_ID),
    CONSTRAINT fk_invoice_customer FOREIGN KEY (Cus_ID) REFERENCES Customers(Cus_ID)
);

-- EmployeeCar junction table (Employee SELLS Car — many-to-many)
CREATE TABLE EmployeeCar (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    EmpID   INT NOT NULL,
    Car_ID  INT NOT NULL,
    UNIQUE KEY uq_emp_car (EmpID, Car_ID),
    CONSTRAINT fk_empcar_employee FOREIGN KEY (EmpID)   REFERENCES Employees(EmpID) ON DELETE CASCADE,
    CONSTRAINT fk_empcar_car      FOREIGN KEY (Car_ID)  REFERENCES Cars(Car_ID)     ON DELETE CASCADE
);

-- ─── Step 4: Install Triggers ──────────────────────────────────────────────────

-- Trigger 1: Auto-mark Car as SOLD on Invoice creation
DROP TRIGGER IF EXISTS trg_after_invoice_insert_mark_sold;
DELIMITER $$
CREATE TRIGGER trg_after_invoice_insert_mark_sold
AFTER INSERT ON Invoices
FOR EACH ROW
BEGIN
    UPDATE Cars SET status = 'sold' WHERE Car_ID = NEW.Car_ID;
END$$
DELIMITER ;

-- Trigger 2: Auto-record SELLS relationship on Invoice creation
DROP TRIGGER IF EXISTS trg_after_invoice_insert_sells;
DELIMITER $$
CREATE TRIGGER trg_after_invoice_insert_sells
AFTER INSERT ON Invoices
FOR EACH ROW
BEGIN
    DECLARE existing_count INT DEFAULT 0;
    SELECT COUNT(*) INTO existing_count
    FROM EmployeeCar WHERE EmpID = NEW.EmpID AND Car_ID = NEW.Car_ID;
    IF existing_count = 0 THEN
        INSERT INTO EmployeeCar (EmpID, Car_ID) VALUES (NEW.EmpID, NEW.Car_ID);
    END IF;
END$$
DELIMITER ;

-- Trigger 3: Revert Car to AVAILABLE when Invoice is deleted
DROP TRIGGER IF EXISTS trg_after_invoice_delete_revert_status;
DELIMITER $$
CREATE TRIGGER trg_after_invoice_delete_revert_status
AFTER DELETE ON Invoices
FOR EACH ROW
BEGIN
    DECLARE remaining_invoices INT DEFAULT 0;
    SELECT COUNT(*) INTO remaining_invoices FROM Invoices WHERE Car_ID = OLD.Car_ID;
    IF remaining_invoices = 0 THEN
        UPDATE Cars SET status = 'available' WHERE Car_ID = OLD.Car_ID;
    END IF;
END$$
DELIMITER ;

-- Trigger 4: Prevent deleting Employee with active Invoices
DROP TRIGGER IF EXISTS trg_before_employee_delete_check;
DELIMITER $$
CREATE TRIGGER trg_before_employee_delete_check
BEFORE DELETE ON Employees
FOR EACH ROW
BEGIN
    DECLARE invoice_count INT DEFAULT 0;
    SELECT COUNT(*) INTO invoice_count FROM Invoices WHERE EmpID = OLD.EmpID;
    IF invoice_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete employee: they have existing sales invoices. Reassign or delete invoices first.';
    END IF;
END$$
DELIMITER ;

-- ─── Step 5: Seed default admin user ──────────────────────────────────────────
-- Default login: admin / admin123 (bcrypt hash of 'admin123')
-- CHANGE THIS PASSWORD after first login!
INSERT INTO Users (username, password, role) VALUES
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- ─── Done ──────────────────────────────────────────────────────────────────────
SELECT 'KAPP-BMW database setup complete!' AS Status;
SELECT table_name, table_rows
FROM information_schema.tables
WHERE table_schema = 'kapp_bmw'
ORDER BY table_name;
