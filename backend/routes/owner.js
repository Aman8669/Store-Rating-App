const express = require('express');

module.exports = (prisma) => {
  const router = express.Router();

  // GET: Get My Store Info and Ratings
  router.get('/my-store', async (req, res) => {
    try {
      const ownerId = parseInt(req.user.id, 10);

      // Logged-in owner ka store dhoondein
      const store = await prisma.store.findFirst({
        where: { ownerId: ownerId },
        include: {
          ratings: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
        },
      });

      if (!store) {
        return res.status(404).json({ message: 'No store found assigned to this owner.' });
      }

      // Calculate Average and Count using 'ratingValue'
      const totalRatingsCount = store.ratings.length;
      const totalScore = store.ratings.reduce((acc, r) => acc + (r.ratingValue || 0), 0);
      const avg = totalRatingsCount ? (totalScore / totalRatingsCount).toFixed(1) : '0.0';

      res.json({
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: avg,
        totalRatingsCount: totalRatingsCount,
        ratings: store.ratings,
      });
    } catch (err) {
      console.error('Owner Store Error:', err);
      res.status(500).json({ message: 'Error fetching owner store info' });
    }
  });

  return router;
};