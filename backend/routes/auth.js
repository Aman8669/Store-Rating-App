const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (prisma) => {
  const router = express.Router();

  // POST: /api/auth/login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Case-insensitive email lookup
      const user = await prisma.user.findFirst({
        where: { email: email.trim().toLowerCase() },
      });

      if (!user) {
        console.log(`Login Failed: User ${email} not found`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Compare Password with bcrypt
      let isMatch = await bcrypt.compare(password, user.password);

      // Fallback: Direct match if password was saved in plain text
      if (!isMatch && user.password === password) {
        isMatch = true;
      }

      if (!isMatch) {
        console.log(`Login Failed: Password mismatch for ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check JWT Secret
      const secret = process.env.JWT_SECRET || 'supersecretkey123';

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: '1d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error('Login Error:', err);
      res.status(500).json({ message: 'Server error during login' });
    }
  });

  return router;
};