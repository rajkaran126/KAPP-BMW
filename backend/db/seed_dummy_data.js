const sequelize = require('../config/database');
const Employee = require('../models/Employee');
const EmployeeQualification = require('../models/EmployeeQualification');
const Car = require('../models/Car');
const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');
const EmployeeCar = require('../models/EmployeeCar');
const User = require('../models/User');

const seedData = async () => {
    try {
        console.log('🚀 Starting BMW Showroom Dummy Data Seeding (Jan 1, 2026 - July 28, 2026)...');

        // Sync schema
        await sequelize.sync({ force: true });
        console.log('✓ Database schema refreshed.');

        // 1. Seed Users (Admin & Staff)
        await User.bulkCreate([
            { username: 'admin', password: 'admin123', name: 'System Administrator', role: 'Admin' },
            { username: 'manager_blr', password: 'password123', name: 'Rohan Sharma (BLR Lead)', role: 'Manager' },
            { username: 'manager_mum', password: 'password123', name: 'Priya Nair (MUM Lead)', role: 'Manager' },
            { username: 'manager_hyd', password: 'password123', name: 'Vikram Reddy (HYD Lead)', role: 'Manager' }
        ]);
        console.log('✓ Seeded Users.');

        // 2. Seed Employees across Bangalore, Hyderabad, and Mumbai
        const employeesData = [
            // Bangalore Team
            { Name: 'Rohan Sharma', designation: 'Senior Sales Manager', Address: 'Indiranagar, Bangalore, Karnataka' },
            { Name: 'Arjun Mehta', designation: 'M Performance Specialist', Address: 'Koramangala, Bangalore, Karnataka' },
            { Name: 'Deepika Rao', designation: 'EV Mobility Consultant', Address: 'Whitefield, Bangalore, Karnataka' },
            { Name: 'Siddharth Varma', designation: 'Client Relationship Executive', Address: 'UB City, Bangalore, Karnataka' },
            { Name: 'Ananya Hegde', designation: 'Luxury Vehicle Advisor', Address: 'Jayanagar, Bangalore, Karnataka' },

            // Mumbai Team
            { Name: 'Priya Nair', designation: 'Regional Sales Director', Address: 'Worli, Mumbai, Maharashtra' },
            { Name: 'Ananya Deshmukh', designation: 'Luxury Car Consultant', Address: 'Bandra West, Mumbai, Maharashtra' },
            { Name: 'Kabir Kapoor', designation: 'M Performance Brand Manager', Address: 'Juhu, Mumbai, Maharashtra' },
            { Name: 'Rupesh Patil', designation: 'Senior Sales Executive', Address: 'Lower Parel, Mumbai, Maharashtra' },
            { Name: 'Neha Kulkarni', designation: 'Customer Experience Manager', Address: 'Powai, Mumbai, Maharashtra' },

            // Hyderabad Team
            { Name: 'Vikram Reddy', designation: 'Showroom General Manager', Address: 'Banjara Hills, Hyderabad, Telangana' },
            { Name: 'Kavya Rao', designation: 'Senior Sales Consultant', Address: 'Jubilee Hills, Hyderabad, Telangana' },
            { Name: 'Aditya Raju', designation: 'BMW i Electric Specialist', Address: 'Gachibowli, Hyderabad, Telangana' },
            { Name: 'Sandeep Kumar', designation: 'Corporate Fleet Sales Head', Address: 'HITEC City, Hyderabad, Telangana' },
            { Name: 'Manasa Teja', designation: 'Customer Support Lead', Address: 'Madhapur, Hyderabad, Telangana' }
        ];

        const employees = await Employee.bulkCreate(employeesData);
        console.log(`✓ Seeded ${employees.length} Employees across Bangalore, Mumbai, and Hyderabad.`);

        // 3. Seed Employee Qualifications
        const qualificationsData = [];
        employees.forEach(emp => {
            qualificationsData.push(
                { EmpID: emp.EmpID, qualification: 'B.Tech Automobile Engineering' },
                { EmpID: emp.EmpID, qualification: 'BMW Certified Sales Master 2025' }
            );
            if (emp.designation.includes('Manager') || emp.designation.includes('Director')) {
                qualificationsData.push({ EmpID: emp.EmpID, qualification: 'MBA Executive Luxury Management' });
            }
            if (emp.designation.includes('Performance') || emp.designation.includes('M')) {
                qualificationsData.push({ EmpID: emp.EmpID, qualification: 'BMW M Track Driving Instructor' });
            }
            if (emp.designation.includes('EV') || emp.designation.includes('Electric')) {
                qualificationsData.push({ EmpID: emp.EmpID, qualification: 'Certified High-Voltage EV Specialist' });
            }
        });
        await EmployeeQualification.bulkCreate(qualificationsData);
        console.log(`✓ Seeded ${qualificationsData.length} Employee Qualifications.`);

        // 4. Seed Customers in Bangalore, Hyderabad, and Mumbai
        const customersData = [
            // Bangalore Customers
            { Name: 'Dr. Rahul Dravid', Ph_No: '+91 98450 11223', Address: 'Sadashivanagar', City: 'Bangalore', Country: 'India' },
            { Name: 'Kiran Mazumdar', Ph_No: '+91 98451 22334', Address: 'Lavelle Road', City: 'Bangalore', Country: 'India' },
            { Name: 'Nandan Nilekani', Ph_No: '+91 98452 33445', Address: 'Koramangala 3rd Block', City: 'Bangalore', Country: 'India' },
            { Name: 'Suhasini Naidu', Ph_No: '+91 98453 44556', Address: 'Indiranagar 100ft Rd', City: 'Bangalore', Country: 'India' },
            { Name: 'Varun Reddy', Ph_No: '+91 98454 55667', Address: 'HSR Layout Sector 1', City: 'Bangalore', Country: 'India' },
            { Name: 'Ayesha Khan', Ph_No: '+91 98455 66778', Address: 'Benson Town', City: 'Bangalore', Country: 'India' },
            { Name: 'Gautam Shenoy', Ph_No: '+91 98456 77889', Address: 'Dollar Colony', City: 'Bangalore', Country: 'India' },
            { Name: 'Tarun Murthy', Ph_No: '+91 98457 88990', Address: 'Whitefield Palm Meadows', City: 'Bangalore', Country: 'India' },

            // Mumbai Customers
            { Name: 'Rajesh Singhania', Ph_No: '+91 98200 11122', Address: 'Altamount Road', City: 'Mumbai', Country: 'India' },
            { Name: 'Karan Johar', Ph_No: '+91 98201 22233', Address: 'Carter Road, Bandra', City: 'Mumbai', Country: 'India' },
            { Name: 'Zoya Akhtar', Ph_No: '+91 98202 33344', Address: 'Juhu Tara Road', City: 'Mumbai', Country: 'India' },
            { Name: 'Anil Ambani', Ph_No: '+91 98203 44455', Address: 'Cuffe Parade', City: 'Mumbai', Country: 'India' },
            { Name: 'Rhea Kapoor', Ph_No: '+91 98204 55566', Address: 'Parel Crest Towers', City: 'Mumbai', Country: 'India' },
            { Name: 'Sameer Merchant', Ph_No: '+91 98205 66677', Address: 'Marine Drive', City: 'Mumbai', Country: 'India' },
            { Name: 'Pooja Bhatt', Ph_No: '+91 98206 77788', Address: 'Versova Beach Rd', City: 'Mumbai', Country: 'India' },
            { Name: 'Vikramaditya Shroff', Ph_No: '+91 98207 88899', Address: 'Malabar Hill', City: 'Mumbai', Country: 'India' },

            // Hyderabad Customers
            { Name: 'Allu Venkatesh', Ph_No: '+91 99890 12345', Address: 'Jubilee Hills Road No. 36', City: 'Hyderabad', Country: 'India' },
            { Name: 'Nagarjuna Akkineni', Ph_No: '+91 99891 23456', Address: 'Banjara Hills Road No. 12', City: 'Hyderabad', Country: 'India' },
            { Name: 'Lakshmi Manchu', Ph_No: '+91 99892 34567', Address: 'Film Nagar', City: 'Hyderabad', Country: 'India' },
            { Name: 'Dr. K. T. Rama Rao', Ph_No: '+91 99893 45678', Address: 'Prashasan Nagar', City: 'Hyderabad', Country: 'India' },
            { Name: 'Prabhas Raju', Ph_No: '+91 99894 56789', Address: 'Gachibowli ORR', City: 'Hyderabad', Country: 'India' },
            { Name: 'Sowmya Reddy', Ph_No: '+91 99895 67890', Address: 'Financial District', City: 'Hyderabad', Country: 'India' },
            { Name: 'Mahesh Babu', Ph_No: '+91 99896 78901', Address: 'Kavuri Hills', City: 'Hyderabad', Country: 'India' },
            { Name: 'Harsha Vardhan', Ph_No: '+91 99897 89012', Address: 'Madhapur Cyber Towers', City: 'Hyderabad', Country: 'India' }
        ];

        const customers = await Customer.bulkCreate(customersData);
        console.log(`✓ Seeded ${customers.length} Customers.`);

        // 5. Seed BMW Cars Fleet (50 cars)
        const modelsList = [
            { Model: 'BMW 3 Series 330i', price: 55000 },
            { Model: 'BMW 5 Series 530d', price: 78000 },
            { Model: 'BMW 7 Series 740i', price: 140000 },
            { Model: 'BMW X1 sDrive20i', price: 48000 },
            { Model: 'BMW X3 xDrive30i', price: 65000 },
            { Model: 'BMW X5 xDrive40i', price: 92000 },
            { Model: 'BMW X7 xDrive40d', price: 135000 },
            { Model: 'BMW M3 Competition', price: 95000 },
            { Model: 'BMW M4 Coupe', price: 102000 },
            { Model: 'BMW M5 CS', price: 150000 },
            { Model: 'BMW i4 eDrive40', price: 68000 },
            { Model: 'BMW i7 xDrive60', price: 165000 },
            { Model: 'BMW iX xDrive50', price: 115000 }
        ];

        const colors = ['Mineral White', 'Black Sapphire', 'Portimao Blue', 'Phytonic Blue', 'Toronto Red', 'Isle of Man Green', 'Dravit Grey', 'Aventurin Red'];
        const years = [2025, 2026];

        const carsData = [];
        for (let i = 1; i <= 50; i++) {
            const m = modelsList[i % modelsList.length];
            carsData.push({
                IL_No: `IL-2026-${100 + i}`,
                Mod_No: `MOD-${m.Model.replace(/ /g, '-').toUpperCase()}`,
                Model: m.Model,
                Colour: colors[i % colors.length],
                Year: years[i % years.length],
                status: 'available' // Will update to 'sold' for cars with invoices
            });
        }

        const cars = await Car.bulkCreate(carsData);
        console.log(`✓ Seeded ${cars.length} BMW Cars.`);

        // 6. Generate Sales Invoices from Jan 1, 2026 to July 28, 2026
        const startDate = new Date('2026-01-02');
        const endDate = new Date('2026-07-28');
        const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

        const invoicesData = [];
        const employeeCarData = [];
        const soldCarIds = [];

        // Generate 32 sales distributed across the timeframe
        for (let i = 0; i < 32; i++) {
            const randomDayOffset = Math.floor((i / 32) * totalDays) + (i % 3);
            const invoiceDate = new Date(startDate.getTime() + randomDayOffset * 24 * 60 * 60 * 1000);
            const dateStr = invoiceDate.toISOString().split('T')[0];

            const car = cars[i];
            const emp = employees[i % employees.length];
            const cus = customers[i % customers.length];
            
            // Find price based on model
            const matchedModel = modelsList.find(m => m.Model === car.Model);
            const saleAmount = matchedModel ? matchedModel.price : 75000;

            invoicesData.push({
                Date: dateStr,
                amount: saleAmount,
                EmpID: emp.EmpID,
                Car_ID: car.Car_ID,
                Cus_ID: cus.Cus_ID
            });

            employeeCarData.push({
                EmpID: emp.EmpID,
                Car_ID: car.Car_ID
            });

            soldCarIds.push(car.Car_ID);
        }

        const invoices = await Invoice.bulkCreate(invoicesData);
        await EmployeeCar.bulkCreate(employeeCarData);

        // Update sold cars status
        await Car.update({ status: 'sold' }, { where: { Car_ID: soldCarIds } });

        console.log(`✓ Seeded ${invoices.length} Invoices & Sales Records from Jan 1, 2026 to July 28, 2026.`);
        console.log(`✓ Marked ${soldCarIds.length} Cars as 'sold' and left ${cars.length - soldCarIds.length} as 'available' in inventory.`);

        console.log('\n======================================================');
        console.log(' 🎉 BMW DUMMY DATA SEEDING COMPLETE!');
        console.log('======================================================');
        console.log(` - Total Employees: ${employees.length} (Bangalore, Mumbai, Hyderabad)`);
        console.log(` - Total Customers: ${customers.length}`);
        console.log(` - Total BMW Cars: ${cars.length} (${soldCarIds.length} Sold, ${cars.length - soldCarIds.length} Available)`);
        console.log(` - Total Invoices: ${invoices.length}`);
        console.log('======================================================\n');

        process.exit(0);
    } catch (err) {
        console.error('✗ Seeding failed:', err);
        process.exit(1);
    }
};

seedData();
