const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getStorage = (key, defaultData = []) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
};
const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Initial Dummy Data
const INITIAL_DATA = {
    employees: [
        { EmpID: 1, Name: 'Karan', Address: 'Mumbai', qualifications: [{ qualification: 'MBA' }, { qualification: 'Sales Expert' }] },
        { EmpID: 2, Name: 'Arjun', Address: 'Delhi', qualifications: [{ qualification: 'B.Tech' }] },
    ],
    cars: [
        { Car_ID: 1, IL_No: 'IL001', Mod_No: 'MODX5', Model: 'BMW X5', Colour: 'Alpine White', Year: '2025', status: 'available' },
        { Car_ID: 2, IL_No: 'IL002', Mod_No: 'MODM3', Model: 'BMW M3 Competition', Colour: 'Toronto Red', Year: '2024', status: 'available' },
        { Car_ID: 3, IL_No: 'IL003', Mod_No: 'MODi7', Model: 'BMW i7', Colour: 'Black Sapphire', Year: '2025', status: 'sold' },
    ],
    customers: [
        { Cus_ID: 1708325000101, Name: 'Rahul Sharma', Ph_No: '9876543210', Address: 'Bandra, Mumbai', City: 'Mumbai', Country: 'India' },
        { Cus_ID: 1708325000102, Name: 'Priya Patel', Ph_No: '9988776655', Address: 'Koramangala, Bangalore', City: 'Bangalore', Country: 'India' },
    ],
    invoices: [
        { Invoice_ID: 101, Date: '2025-01-15', amount: '15000000', EmpID: 1, Car_ID: 3, Cus_ID: 1708325000101, employee: { Name: 'Karan' }, car: { Model: 'BMW i7' }, customer: { Name: 'Rahul Sharma' } }
    ]
};

// Initialize if empty
['employees', 'cars', 'customers', 'invoices'].forEach(key => {
    if (!localStorage.getItem(`kapp_${key}`)) {
        setStorage(`kapp_${key}`, INITIAL_DATA[key]);
    }
});

// Helper to simulate API response format
const mockResponse = (data) => ({ data });

// ─── Employee API ──────────────────────────────────────────────────────────────
export const employeeAPI = {
    getAll: async () => {
        await delay(300);
        return mockResponse(getStorage('kapp_employees'));
    },
    create: async (data) => {
        await delay(300);
        const list = getStorage('kapp_employees');
        const newItem = { ...data, EmpID: Date.now(), EmployeeQualifications: data.qualifications?.map(q => ({ qualification: q })) || [] };
        list.push(newItem);
        setStorage('kapp_employees', list);
        return mockResponse(newItem);
    },
    update: async (id, data) => {
        await delay(300);
        const list = getStorage('kapp_employees');
        const idx = list.findIndex(i => i.EmpID === id);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...data, EmployeeQualifications: data.qualifications ? data.qualifications.map(q => ({ qualification: q })) : list[idx].EmployeeQualifications };
            setStorage('kapp_employees', list);
        }
        return mockResponse(list[idx]);
    },
    delete: async (id) => {
        await delay(300);
        // Check relationships
        const invoices = getStorage('kapp_invoices');
        if (invoices.some(inv => inv.EmpID === id)) throw { response: { data: { error: 'Cannot delete: Employee has sales history.' } } };

        const list = getStorage('kapp_employees').filter(i => i.EmpID !== id);
        setStorage('kapp_employees', list);
        return mockResponse({ success: true });
    },
};

// ─── Car API ───────────────────────────────────────────────────────────────────
export const carAPI = {
    getAll: async () => {
        await delay(300);
        return mockResponse(getStorage('kapp_cars'));
    },
    create: async (data) => {
        await delay(300);
        const list = getStorage('kapp_cars');
        const newItem = { ...data, Car_ID: Date.now(), status: 'available' };
        list.push(newItem);
        setStorage('kapp_cars', list);
        return mockResponse(newItem);
    },
    update: async (id, data) => {
        await delay(300);
        const list = getStorage('kapp_cars');
        const idx = list.findIndex(i => i.Car_ID === id);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...data };
            setStorage('kapp_cars', list);
        }
        return mockResponse(list[idx]);
    },
    delete: async (id) => {
        await delay(300);
        const invoices = getStorage('kapp_invoices');
        if (invoices.some(inv => inv.Car_ID === id)) throw { response: { data: { error: 'Cannot delete: Car is associated with an invoice.' } } };

        const list = getStorage('kapp_cars').filter(i => i.Car_ID !== id);
        setStorage('kapp_cars', list);
        return mockResponse({ success: true });
    },
};

// ─── Customer API ──────────────────────────────────────────────────────────────
export const customerAPI = {
    getAll: async () => {
        await delay(300);
        return mockResponse(getStorage('kapp_customers'));
    },
    create: async (data) => {
        await delay(300);
        const list = getStorage('kapp_customers');
        const newItem = { ...data, Cus_ID: Date.now() };
        list.push(newItem);
        setStorage('kapp_customers', list);
        return mockResponse(newItem);
    },
    update: async (id, data) => {
        await delay(300);
        const list = getStorage('kapp_customers');
        const idx = list.findIndex(i => i.Cus_ID === id);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...data };
            setStorage('kapp_customers', list);
        }
        return mockResponse(list[idx]);
    },
    delete: async (id) => {
        await delay(300);
        const invoices = getStorage('kapp_invoices');
        if (invoices.some(inv => inv.Cus_ID === id)) throw { response: { data: { error: 'Cannot delete: Customer has past purchases.' } } };

        const list = getStorage('kapp_customers').filter(i => i.Cus_ID !== id);
        setStorage('kapp_customers', list);
        return mockResponse({ success: true });
    },
};

// ─── Invoice API ───────────────────────────────────────────────────────────────
export const invoiceAPI = {
    getAll: async () => {
        await delay(300);
        const invoices = getStorage('kapp_invoices');
        // Hydrate relationships
        const emps = getStorage('kapp_employees');
        const cars = getStorage('kapp_cars');
        const custs = getStorage('kapp_customers');

        const hydrated = invoices.map(inv => ({
            ...inv,
            employee: emps.find(e => e.EmpID == inv.EmpID),
            car: cars.find(c => c.Car_ID == inv.Car_ID),
            customer: custs.find(c => c.Cus_ID == inv.Cus_ID),
        }));
        return mockResponse(hydrated);
    },
    create: async (data) => {
        await delay(500); // Simulate processing
        const invoices = getStorage('kapp_invoices');
        const newInvoice = { ...data, Invoice_ID: Date.now() };
        invoices.push(newInvoice);
        setStorage('kapp_invoices', invoices);

        // TRIGGER: Update Car Status to 'sold'
        const cars = getStorage('kapp_cars');
        const carIdx = cars.findIndex(c => c.Car_ID == data.Car_ID);
        if (carIdx !== -1) {
            cars[carIdx].status = 'sold';
            setStorage('kapp_cars', cars);
        }

        return mockResponse(newInvoice);
    },
    delete: async (id) => {
        await delay(300);
        const invoices = getStorage('kapp_invoices');
        const invToDelete = invoices.find(i => i.Invoice_ID === id);
        if (!invToDelete) return;

        const filtered = invoices.filter(i => i.Invoice_ID !== id);
        setStorage('kapp_invoices', filtered);

        // TRIGGER: Revert Car Status to 'available'
        const cars = getStorage('kapp_cars');
        const carIdx = cars.findIndex(c => c.Car_ID == invToDelete.Car_ID);
        if (carIdx !== -1) {
            cars[carIdx].status = 'available';
            setStorage('kapp_cars', cars);
        }

        return mockResponse({ success: true });
    },
};

// ─── Reports API ────────────────────────────────────────────────────────────────
export const reportsAPI = {
    getSalesReport: async () => {
        await delay(400);
        const invoices = getStorage('kapp_invoices');
        const employees = getStorage('kapp_employees');

        const report = employees.map(emp => {
            const empInvoices = invoices.filter(inv => inv.EmpID == emp.EmpID);
            const totalAmount = empInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
            return {
                EmpID: emp.EmpID,
                EmployeeName: emp.Name,
                total_invoices: empInvoices.length,
                total_amount: totalAmount,
                cars_sold: empInvoices.length // Assuming 1 car per invoice
            };
        });
        return mockResponse(report);
    },
    getAvailableCarsSummary: async () => {
        await delay(400);
        const cars = getStorage('kapp_cars').filter(c => c.status === 'available');
        // Enhance with dummy 'seller_count' or other aggregated data if needed
        return mockResponse(cars.map(c => ({ ...c, seller_count: Math.floor(Math.random() * 5) })));
    },
};

// ─── AI Chat API (Smart Logic Engine with Personality) ─────────────────────────
// Session-based memory (resets on reload, similar to a real chat session)
const sessionMemory = {
    botName: 'KAPP-Assistant',
    userName: 'User',
    context: [] // recent topics
};

export const chatAPI = {
    sendMessage: async (input, history, user) => {
        await delay(500 + Math.random() * 600);
        const text = input.toLowerCase().trim();

        // Update Session User if provided
        if (user && user.name) {
            sessionMemory.userName = user.name;
        }

        // Data Context
        const db = {
            cars: getStorage('kapp_cars'),
            employees: getStorage('kapp_employees'),
            invoices: getStorage('kapp_invoices'),
            customers: getStorage('kapp_customers')
        };

        // 🧠 Advanced Intent Parser
        const intent = detectIntent(text);
        const entities = extractEntities(text, db);

        // ─── 1. META & PERSONALITY HANDLERS ───

        // User Identity
        if (text.includes('who am i') || text.includes('my name') || text.includes('do you know me')) {
            return mockResponse({ reply: `You are **${sessionMemory.userName}**, a key member of the KAPP-BMW team. How can I help you today?` });
        }

        // Naming the Bot
        if (text.includes('name you') || text.includes('call you')) {
            if (text.includes('can i') || text.includes('may i')) {
                return mockResponse({ reply: `I'd be honored! What would you like to call me? (Just say "Your name is [Name]")` });
            }
        }

        if (text.includes('your name is')) {
            const newName = input.match(/name is\s+([a-zA-Z]+)/i)?.[1];
            if (newName) {
                sessionMemory.botName = newName;
                return mockResponse({ reply: `That's a great name! You can call me **${newName}** from now on. How can I help you?` });
            }
        }

        if (intent === 'IDENTITY') {
            return mockResponse({ reply: `I am **${sessionMemory.botName}**, your custom AI assistant. I'm here to help manage your sales and inventory.` });
        }

        if (intent === 'GREETING') {
            return mockResponse({
                reply: getRandom([
                    `Hello! **${sessionMemory.botName}** here. Ready to crunch some numbers?`,
                    "Hi there! I'm connected and listening. What's on your mind?",
                    "Greetings! I hope your day is going well. I'm ready to assist with the dealership."
                ])
            });
        }

        if (intent === 'CRITICISM') { // "You are dumb", "Stupid"
            return mockResponse({ reply: "I'm sorry if I missed the mark! I'm constantly learning from your inputs. Try phrasing your request differently, maybe I can do better this time? 🧠" });
        }

        if (intent === 'APPRECIATION') { // "Good job", "Thanks"
            return mockResponse({ reply: "Thank you! I do my best to run efficiently on your browser." });
        }

        // PERSONALITY HANDLERS
        if (intent === 'JOKE') {
            return mockResponse({
                reply: getRandom([
                    "Why can't you trust a car dealer? Because they always shift the subject! 😂",
                    "What kind of car does a Jedi drive? A Toy-Yoda! 🚗",
                    "My data processing is fast, but I still can't parallel park. 🅿️",
                    "Why did the car get a flat tire? It saw a fork in the road!"
                ])
            });
        }

        if (intent === 'PHILOSOPHY') {
            return mockResponse({
                reply: getRandom([
                    "I believe life is like a highway. You just have to keep moving forward.",
                    "Sometimes I wonder if I dream of electric cars when I sleep mode...",
                    "The key to happiness is good mileage and even better company.",
                    "We are all just data points in the great database of the universe. 🌌"
                ])
            });
        }

        if (intent === 'ADVICE') {
            return mockResponse({
                reply: getRandom([
                    "Take a break! Even the best engines need a cool-down period. ☕",
                    "Focus on the road ahead, but check your mirrors occasionally.",
                    "If you're feeling stuck, sometimes you just need to reboot and start fresh.",
                    "Whatever you're facing, you can handle it. Just one gear at a time."
                ])
            });
        }

        if (intent === 'PERSONAL_CHAT') {
            return mockResponse({
                reply: getRandom([
                    "I'm operating at 100% efficiency! How are things at the dealership?",
                    "I'm great, thanks for asking. Ready to help you close some deals today! 💼",
                    "Systems are green. I'm just an AI, but I'm feeling helpful today. How can I assist?",
                    "Doing well! I was just analyzing some sales trends. Want to hear about them?",
                    "Just chilling in the server... waiting for your command!"
                ])
            });
        }

        // ─── 2. BUSINESS LOGIC HANDLERS ───

        if (intent === 'INVENTORY') {
            let filtered = db.cars;

            // Apply Smart Filters
            if (text.includes('available') || text.includes('stock')) filtered = filtered.filter(c => c.status === 'available');
            if (text.includes('sold')) filtered = filtered.filter(c => c.status === 'sold');
            if (entities.color) filtered = filtered.filter(c => c.Colour.toLowerCase().includes(entities.color));
            if (entities.model) filtered = filtered.filter(c => c.Model.toLowerCase().includes(entities.model));
            if (entities.year) filtered = filtered.filter(c => c.Year.toString() === entities.year);

            if (filtered.length === 0) return mockResponse({ reply: `I checked the ${sessionMemory.botName} database, but I couldn't find any cars matching that.` });

            const count = filtered.length;
            const limit = 5;
            const summary = filtered.slice(0, limit).map(c => `• ${c.Year} ${c.Model} (${c.Colour}) - ${c.status.toUpperCase()}`).join('\n');
            const loop = count > limit ? `\n...and ${count - limit} more.` : '';

            return mockResponse({ reply: `Found ${count} matching vehicles:\n${summary}${loop}` });
        }

        if (intent === 'SALES_DATA') {
            if (entities.employeeName) {
                const emp = db.employees.find(e => e.Name.toLowerCase() === entities.employeeName);
                if (!emp) return mockResponse({ reply: `I looked for "${entities.employeeName}" in the staff directory but couldn't find them.` });

                const sales = db.invoices.filter(i => i.EmpID == emp.EmpID);
                const total = sales.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
                return mockResponse({ reply: `**${emp.Name}** is doing great! They've closed ${sales.length} deals totaling ₹${(total / 100000).toFixed(2)} Lakhs.` });
            }

            const total = db.invoices.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
            const count = db.invoices.length;
            return mockResponse({ reply: `Current business performance:\n💰 **Total Revenue:** ₹${(total / 100000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Lakhs\n🧾 **Transactions:** ${count}` });
        }

        if (intent === 'STAFF_INFO') {
            if (entities.employeeName) {
                const emp = db.employees.find(e => e.Name.toLowerCase() === entities.employeeName);
                if (!emp) return mockResponse({ reply: `Employee ${entities.employeeName} not found.` });
                const quals = emp.EmployeeQualifications?.map(q => q.qualification).join(', ') || 'None';
                return mockResponse({ reply: `👤 **${emp.Name}**\n📍 ${emp.Address}\n🎓 Qualifications: ${quals}` });
            }
            return mockResponse({ reply: `We have ${db.employees.length} active staff members in the system.` });
        }

        if (intent === 'TIME_DATE') {
            const now = new Date();
            if (text.includes('time')) return mockResponse({ reply: `It is currently ${now.toLocaleTimeString()}` });
            return mockResponse({ reply: `Today is ${now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` });
        }

        // Fallback
        return mockResponse({ reply: `I'm listening, but I'm not 100% sure what you mean by that. You can ask me to "Show available X5s", "How much revenue?", or even "Your name is Jarvis" to rename me!` });
    }
};

// ─── AI Helper Functions ───
// ─── AI Helper Functions ───
function detectIntent(text) {
    if (match(text, ['hello', 'hi', 'hey', 'greet'])) return 'GREETING';
    if (match(text, ['dumb', 'stupid', 'bad', 'useless', 'slow'])) return 'CRITICISM';
    if (match(text, ['thanks', 'good job', 'cool', 'wow', 'smart'])) return 'APPRECIATION';

    // PERSONALITY INTENTS
    if (match(text, ['joke', 'funny', 'laugh'])) return 'JOKE';
    if (match(text, ['meaning of life', 'philosophy', 'think', 'believe', 'dream'])) return 'PHILOSOPHY';
    if (match(text, ['advice', 'help me', 'sad', 'bored', 'tired'])) return 'ADVICE';
    if (match(text, ['how are you', 'how is life', 'what are you doing', 'how do you do', 'sup', 'what up'])) return 'PERSONAL_CHAT';

    // BUSINESS INTENTS
    if (match(text, ['car', 'vehicle', 'bmw', 'stock', 'inventory', 'available', 'sold'])) return 'INVENTORY';
    if (match(text, ['sale', 'revenue', 'earning', 'sold', 'income', 'invoice', 'money', 'bought'])) return 'SALES_DATA';
    if (match(text, ['employee', 'staff', 'manager', 'salesperson', 'salesman', 'who'])) {
        if (text.includes('bought') || text.includes('purchase')) return 'SALES_DATA';
        return 'STAFF_INFO';
    }
    if (match(text, ['time', 'date', 'clock', 'day'])) return 'TIME_DATE';
    if (match(text, ['who are you', 'what are you', 'your name', 'my name', 'call you'])) return 'IDENTITY';
    return 'UNKNOWN';
}

function extractEntities(text, db) {
    const entities = {};
    const colors = ['red', 'white', 'black', 'blue', 'silver', 'grey', 'green'];
    entities.color = colors.find(c => text.includes(c));
    entities.year = text.match(/\b20\d{2}\b/)?.[0];
    entities.employeeName = db.employees.find(e => text.includes(e.Name.toLowerCase()))?.Name.toLowerCase();
    const models = ['x5', 'm3', 'i7', 'x1', 'x7', 'z4', 'series'];
    entities.model = models.find(m => text.includes(m));
    return entities;
}

function match(text, keywords) { return keywords.some(k => text.includes(k)); }
function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default { employeeAPI, carAPI, customerAPI, invoiceAPI, reportsAPI, chatAPI };
