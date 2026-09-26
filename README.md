# Store Rating Application

A full-stack PERN (PostgreSQL, Express, React, Node.js) web application that allows users to explore registered stores, submit ratings, and manage stores and users through a multi-tier role-based access control system.

---

## 🚀 Live Demo

- **Frontend Application (Vercel):** [https://store-rating-app-wine.vercel.app](https://store-rating-app-wine.vercel.app)
- **Backend API (Render):** [https://store-rating-app-backend-aiv2.onrender.com/api](https://store-rating-app-backend-aiv2.onrender.com/api)

---

## 🔑 Demo Credentials

You can use the following pre-seeded accounts to test different roles:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **SYSTEM_ADMIN** | `admin@storerating.com` | `Password123!` | Full admin access (users, stores, system metrics) |
| **STORE_OWNER** | `owner@storerating.com` | `Password123!` | Manage owned stores and view ratings |
| **NORMAL_USER** | `user@storerating.com` | `Password123!` | Browse stores, submit & update ratings |

---

## ✨ Features

### 👑 System Administrator (`SYSTEM_ADMIN`)
- View total users, total stores, and total submitted ratings.
- Manage users (add, edit, delete, assign roles).
- Add and assign new stores to store owners.

### 🏪 Store Owner (`STORE_OWNER`)
- View assigned stores and overall rating performance.
- See individual ratings and user reviews for their stores.

### 👤 Normal User (`NORMAL_USER`)
- Register and login securely.
- Browse all registered stores with filtering/search capabilities.
- Submit or update ratings (`1` to `5` stars) for stores.

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, Axios, React Router DOM
- **Backend:** Node.js, Express.js (CommonJS)
- **Database & ORM:** PostgreSQL (Neon Serverless), Prisma ORM
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## 📂 Project Structure

```text
Store-Rating-App/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── routes/
│   │   ├── auth.js
│   │   ├── store.js
│   │   └── user.js
│   ├── .env
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 💻 Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL Database](https://neon.tech/) (or local instance)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/Store-Rating-App.git
cd Store-Rating-App
```

---

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@ep-example.neon.tech/neondb?sslmode=require"
JWT_SECRET="your_secure_jwt_secret"
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

Sync Database Schema & Seed Demo Data:
```bash
npx prisma db push
node seed.js
```

Start Backend Server:
```bash
node server.js
```

---

### 3. Frontend Setup
Open a new terminal tab and navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` directory:
```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

Start Vite Development Server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🌐 Deployment Instructions

### Backend (Render)
1. Create a new **Web Service** on Render pointing to your GitHub repo.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install` and **Start Command** to `node server.js`.
4. Add Environment Variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://store-rating-app-wine.vercel.app`

### Frontend (Vercel)
1. Import the repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Add Environment Variable:
   - `VITE_API_BASE_URL=https://store-rating-app-backend-aiv2.onrender.com/api`
5. Deploy and run `Redeploy` if required after adding environment variables.

---

## 🛡 ScreenShotss

<img width="1461" height="833" alt="image" src="https://github.com/user-attachments/assets/53239ee5-4523-4db1-ae8a-274aad8cecf4" />

<img width="1425" height="657" alt="image" src="https://github.com/user-attachments/assets/4a219011-7277-4c9d-bd69-5e9306af66cc" />

<img width="1452" height="526" alt="image" src="https://github.com/user-attachments/assets/4675dc9d-b6b4-436a-8966-669d7b60730e" />
