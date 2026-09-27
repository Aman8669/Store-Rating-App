const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// 1. Production CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://store-rating-app-wine.vercel.app', // ✅ Hardcoded as backup
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined/null entries

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // ✅ Fixes 405
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ✅ Explicitly handle OPTIONS preflight for all routes (fixes 405)
app.options('*', cors());

app.use(express.json());

// 2. Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Store Rating System API is running smoothly!' });
});

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Authorization Middleware
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// Import Routes
app.use('/api/auth', require('./routes/auth')(prisma));
app.use('/api/admin', authenticate, authorize(['SYSTEM_ADMIN']), require('./routes/admin')(prisma));
app.use('/api/user', authenticate, authorize(['NORMAL_USER']), require('./routes/user')(prisma));
app.use('/api/owner', authenticate, authorize(['STORE_OWNER']), require('./routes/owner')(prisma));

// 3. Graceful Shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));