# KAPP-BMW AUTOMOBILE

> **Premium BMW Virtual Showroom** - An immersive 3D web experience built for BMW Internal

A full-stack web application featuring a cinematic 3D BMW showroom with WebGL rendering, AI-powered chatbot, and comprehensive sales management system.

![BMW Showroom](https://img.shields.io/badge/BMW-Showroom-1c69d4?style=for-the-badge&logo=bmw)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.160-black?style=for-the-badge&logo=three.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)

---

##  Features

###  Immersive 3D Experience
- **WebGL-powered showroom** with React Three Fiber
- **Professional lighting** system (Key, Rim, Fill lights + HDRI)
- **ACES Filmic tone mapping** for photorealistic rendering
- **Scroll-based camera navigation** through 3D space
- **Interactive BMW models** with metallic paint shaders

###  AI-Powered Chatbot
- **OpenAI GPT-4 integration** for intelligent assistance
- **BMW knowledge base** with model specifications
- **Glass-morphism UI** with dark luxury styling
- Real-time conversation with context awareness

###  Advanced Database
- **MySQL database** with Sequelize ORM
- **Triggers**: BMW model validation, invoice logging
- **Cursor procedure**: Employee sales summary generation
- Full CRUD operations for all entities

###  Premium Design
- **BMW brand colors**: Graphite black, BMW blue, warm beige accents
- **Glass-morphism effects** with backdrop blur
- **Smooth GSAP animations** and transitions
- **SEO optimized** with proper meta tags

---

##  Project Structure

```
kapp-bmw-automobile/
├── backend/
│   ├── config/
│   │   └── database.js              # Sequelize configuration
│   ├── models/
│   │   ├── Employee.js              # Employee model
│   │   ├── Car.js                   # Car model with BMW validation
│   │   ├── Customer.js              # Customer model
│   │   ├── Invoice.js               # Invoice model
│   │   └── InvoiceLog.js            # Invoice log model
│   ├── routes/
│   │   ├── employees.js             # Employee REST API
│   │   ├── cars.js                  # Car REST API
│   │   ├── customers.js             # Customer REST API
│   │   ├── invoices.js              # Invoice REST API
│   │   └── chat.js                  # AI Chatbot API
│   ├── triggers/
│   │   └── setup-triggers.sql       # Database triggers
│   ├── procedures/
│   │   └── employee-sales-cursor.sql # Cursor stored procedure
│   ├── server.js                    # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Scene3D/
    │   │   │   ├── Scene.jsx        # Main 3D scene
    │   │   │   ├── Lighting.jsx     # Professional lighting
    │   │   │   ├── HeroZone.jsx     # Hero section
    │   │   │   ├── CarDisplayZone.jsx # Car grid
    │   │   │   ├── PromoPanel.jsx   # Marketing panel
    │   │   │   └── DataPanel.jsx    # Data display
    │   │   ├── Chatbot/
    │   │   │   ├── ChatIcon.jsx     # Floating chat button
    │   │   │   └── ChatPanel.jsx    # Chat interface
    │   │   ├── UI/
    │   │   │   ├── HeroOverlay.jsx  # Hero text overlay
    │   │   │   └── VideoBackground.jsx # Video background
    │   │   └── BMW/
    │   │       └── BMWModel.jsx     # BMW 3D model
    │   ├── hooks/
    │   │   ├── useScrollCamera.js   # Scroll navigation
    │   │   └── useChatbot.js        # Chat logic
    │   ├── utils/
    │   │   ├── bmwModels.js         # BMW data
    │   │   └── api.js               # API client
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

##  Installation

### Prerequisites

- **Node.js** 16+ and npm
- **MySQL** 5.7+ or **MariaDB** 10+
- **OpenAI API Key** (for chatbot)

### Step 1: Clone Repository

```bash
cd C:\Users\KARAN\.gemini\antigravity\scratch
cd kapp-bmw-automobile
```

### Step 2: Database Setup

1. **Create MySQL database:**

```sql
CREATE DATABASE kapp_bmw;
```

2. **Run triggers:**

```bash
mysql -u root -p kapp_bmw < backend/triggers/setup-triggers.sql
```

3. **Run cursor procedure:**

```bash
mysql -u root -p kapp_bmw < backend/procedures/employee-sales-cursor.sql
```

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
copy .env.example .env
# Edit .env with your database credentials and OpenAI API key

# Start backend server
npm run dev
```

**Backend runs on:** `http://localhost:5000`

### Step 4: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
copy .env.example .env
# Verify VITE_API_URL=http://localhost:5000

# Start frontend
npm run dev
```

**Frontend runs on:** `http://localhost:3000`

---

## ⚙️ Environment Variables

### Backend (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kapp_bmw
DB_PORT=3306
OPENAI_API_KEY=sk-your-key-here
PORT=5000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

---

## 🎮 Usage

### Exploring the 3D Showroom

1. **Hero Section**: Features BMW M5 with cinematic intro
2. **Scroll Down**: Camera moves through 3D space
3. **Car Display**: Click rotating BMW models to view details
4. **Promo Panel**: Marketing content with warm beige accents

### Using the AI Chatbot

1. Click the **floating blue chat icon** (bottom-right)
2. Ask about BMW models, features, or specifications
3. Get instant AI-powered responses

### Testing Database Features

#### BMW Validation Trigger

```bash
# Try to insert non-BMW car (should fail)
curl -X POST http://localhost:5000/api/cars \
  -H "Content-Type: application/json" \
  -d '{"model": "Tesla Model S", "year": 2024, "price": 80000, "employeeId": 1}'

# Insert valid BMW (should succeed)
curl -X POST http://localhost:5000/api/cars \
  -H "Content-Type: application/json" \
  -d '{"model": "BMW X5", "year": 2024, "price": 75000, "status": "available", "employeeId": 1}'
```

#### Employee Sales Summary

Run in MySQL:

```sql
CALL generate_employee_sales_summary();
SELECT * FROM Employee_Sales_Summary ORDER BY totalCarsSold DESC;
```

---

##  BMW Models Available

| Series | Models |
|--------|--------|
| **Sedan** | BMW 3 Series, BMW 5 Series, BMW 7 Series |
| **SUV** | BMW X1, BMW X3, BMW X5, BMW X7 |
| **Performance** | BMW M3, BMW M4, BMW M5 |
| **Electric** | BMW i4, BMW i7, BMW iX |

---

##  Technical Specifications

### Lighting System

- **Ambient Light**: 0.25 intensity (neutral white)
- **Key Light**: 1.8 intensity (directional, shadows enabled, 2048 shadow map)
- **Rim Light**: 1.2 intensity (BMW blue #8aa4ff, edge separation)
- **Fill Light**: 0.6 intensity (balances shadows)
- **HDRI Environment**: Studio preset with 0.4 intensity
- **Contact Shadows**: 0.5 opacity with blur
- **Tone Mapping**: ACES Filmic with 1.2 exposure

### Material Settings

- **Car Paint**: Metalness 0.9, Roughness 0.25
- **Environment Reflections**: 1.5 intensity
- **Glass Panels**: Transmission 0.9, Opacity 0.4

---

## 📡 API Endpoints

### Employees
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Cars
- `GET /api/cars` - List all cars
- `POST /api/cars` - Create car (with BMW validation)
- `GET /api/cars/:id` - Get car details
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create invoice (auto-logged)
- `GET /api/invoices/:id` - Get invoice
- `GET /api/invoices/logs/all` - Get all invoice logs

### AI Chat
- `POST /api/chat` - Send message to AI assistant

---

##  Troubleshooting

### Database Connection Issues

```bash
# Check MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;

# Check user permissions
GRANT ALL PRIVILEGES ON kapp_bmw.* TO 'root'@'localhost';
```

### 3D Models Not Rendering

- Check browser console for WebGL errors
- Verify browser supports WebGL 2.0
- Try disabling hardware acceleration if performance issues

### Chatbot Not Responding

- Verify OpenAI API key in backend `.env`
- Check backend server logs for API errors
- Ensure backend server is running on port 5000

---

##  License

Internal BMW Project - All Rights Reserved

---

##  Developer Notes

### Adding New BMW Models

Edit `frontend/src/utils/bmwModels.js` and add to the trigger list in `backend/triggers/setup-triggers.sql`

### Customizing Lighting

Adjust values in `frontend/src/components/Scene3D/Lighting.jsx`

### Modifying Color Theme

Update `frontend/tailwind.config.js` color palette

---

##  Credits

Built with:
- React Three Fiber & Drei
- Three.js
- Express.js & Sequelize
- OpenAI GPT-4
- Tailwind CSS
- GSAP

---


