-- ============================================================
-- KAPP-BMW Sales Management — MySQL Triggers
-- ============================================================
-- Run this file after migrate.js to install all triggers.
-- Usage: node backend/db/install_triggers.js
-- ============================================================

USE kapp_bmw;

-- ─── Trigger 1: Auto-mark Car as SOLD on Invoice creation ────────────────────
-- When a new invoice is inserted, automatically update the car's status to 'sold'
DROP TRIGGER IF EXISTS trg_after_invoice_insert_mark_sold;

DELIMITER $$
CREATE TRIGGER trg_after_invoice_insert_mark_sold
AFTER INSERT ON Invoices
FOR EACH ROW
BEGIN
    UPDATE Cars
    SET status = 'sold'
    WHERE Car_ID = NEW.Car_ID;
END$$
DELIMITER ;

-- ─── Trigger 2: Auto-record SELLS relationship on Invoice creation ────────────
-- When a new invoice is inserted, record the Employee-Car SELLS relationship
-- in the EmployeeCar junction table (if not already present)
DROP TRIGGER IF EXISTS trg_after_invoice_insert_sells;

DELIMITER $$
CREATE TRIGGER trg_after_invoice_insert_sells
AFTER INSERT ON Invoices
FOR EACH ROW
BEGIN
    DECLARE existing_count INT DEFAULT 0;

    SELECT COUNT(*) INTO existing_count
    FROM EmployeeCar
    WHERE EmpID = NEW.EmpID AND Car_ID = NEW.Car_ID;

    IF existing_count = 0 THEN
        INSERT INTO EmployeeCar (EmpID, Car_ID)
        VALUES (NEW.EmpID, NEW.Car_ID);
    END IF;
END$$
DELIMITER ;

-- ─── Trigger 3: Revert Car to AVAILABLE when Invoice is deleted ───────────────
-- When an invoice is deleted, check if any other invoices reference the same car.
-- If none exist, mark the car as 'available' again.
DROP TRIGGER IF EXISTS trg_after_invoice_delete_revert_status;

DELIMITER $$
CREATE TRIGGER trg_after_invoice_delete_revert_status
AFTER DELETE ON Invoices
FOR EACH ROW
BEGIN
    DECLARE remaining_invoices INT DEFAULT 0;

    SELECT COUNT(*) INTO remaining_invoices
    FROM Invoices
    WHERE Car_ID = OLD.Car_ID;

    IF remaining_invoices = 0 THEN
        UPDATE Cars
        SET status = 'available'
        WHERE Car_ID = OLD.Car_ID;
    END IF;
END$$
DELIMITER ;

-- ─── Trigger 4: Prevent deleting Employee with active Invoices ────────────────
-- Before deleting an employee, check if they have any invoices.
-- If yes, raise an error to prevent orphaned invoice records.
DROP TRIGGER IF EXISTS trg_before_employee_delete_check;

DELIMITER $$
CREATE TRIGGER trg_before_employee_delete_check
BEFORE DELETE ON Employees
FOR EACH ROW
BEGIN
    DECLARE invoice_count INT DEFAULT 0;

    SELECT COUNT(*) INTO invoice_count
    FROM Invoices
    WHERE EmpID = OLD.EmpID;

    IF invoice_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete employee: they have existing sales invoices. Reassign or delete invoices first.';
    END IF;
END$$
DELIMITER ;
