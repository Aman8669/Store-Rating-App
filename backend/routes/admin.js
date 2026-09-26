const express = require('express');
const bcrypt = require('bcryptjs');

module.exports = (prisma) => {
  const router = express.Router();

  // GET: Dashboard Stats
  router.get('/stats', async (req, res) => {
    try {
      const usersCount = await prisma.user.count();
      const storesCount = await prisma.store.count();
      const ratingsCount = await prisma.rating.count();
      res.json({ users: usersCount, stores: storesCount, ratings: ratingsCount });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching stats' });
    }
  });

  // GET: All Users
  router.get('/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, address: true, role: true },
      });
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  });

  // POST: Create User by Admin
  router.post('/create-user', async (req, res) => {
    try {
      const { name, email, address, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, address, password: hashedPassword, role },
      });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: err.message || 'Error creating user' });
    }
  });

  // POST: Create Store by Admin
  // POST: Create Store by Admin
router.post('/create-store', async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        // 🎯 String ko Integer me convert karein
        ownerId: ownerId ? parseInt(ownerId, 10) : null,
      },
    });

    res.status(201).json(store);
  } catch (err) {
    console.error('Create Store Error:', err);
    res.status(400).json({ message: err.message || 'Error creating store' });
  }
});

  return router;
};