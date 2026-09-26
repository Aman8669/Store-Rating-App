const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// 1. Production CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // Local Vite React server
  process.env.FRONTEND_URL // Deployed Frontend URL (e.g., https://your-app.vercel.app)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests) or if origin is in allowedOrigins list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// 2. Health Check Route (Render/Hosting platforms support checking if API is live)
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

// 3. Graceful Shutdown (Disconnect Prisma on Server Stop)
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