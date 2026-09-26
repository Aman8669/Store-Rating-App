const express = require('express');

module.exports = (prisma) => {
  const router = express.Router();

  // GET: Get Stores list with ratings
  router.get('/stores', async (req, res) => {
    try {
      const stores = await prisma.store.findMany({
        include: { ratings: true },
      });

      const formattedStores = stores.map((store) => {
        // Schema field 'ratingValue' se rating sum karein
        const total = store.ratings.reduce((acc, r) => acc + (r.ratingValue || 0), 0);
        const avg = store.ratings.length ? (total / store.ratings.length).toFixed(1) : '0.0';
        const currentUserRating = store.ratings.find((r) => r.userId === parseInt(req.user.id, 10));

        return {
          id: store.id,
          name: store.name,
          address: store.address,
          overallRating: avg,
          userRating: currentUserRating ? currentUserRating.ratingValue : 0,
        };
      });

      res.json(formattedStores);
    } catch (err) {
      console.error('Fetch Stores Error:', err);
      res.status(500).json({ message: 'Error fetching stores' });
    }
  });

  // POST: Submit or Update Rating
  router.post('/ratings', async (req, res) => {
    try {
      const { storeId, rating } = req.body;

      const parsedStoreId = parseInt(storeId, 10);
      const parsedUserId = parseInt(req.user.id, 10);
      const parsedRating = parseInt(rating, 10);

      if (!parsedStoreId || !parsedRating) {
        return res.status(400).json({ message: 'Invalid storeId or rating' });
      }

      // Check if rating already exists
      const existingRating = await prisma.rating.findFirst({
        where: {
          storeId: parsedStoreId,
          userId: parsedUserId,
        },
      });

      if (existingRating) {
        // Update existing rating
        await prisma.rating.update({
          where: { id: existingRating.id },
          data: { ratingValue: parsedRating },
        });
      } else {
        // Create new rating with ratingValue
        await prisma.rating.create({
          data: {
            storeId: parsedStoreId,
            userId: parsedUserId,
            ratingValue: parsedRating,
          },
        });
      }

      res.json({ message: 'Rating submitted successfully' });
    } catch (err) {
      console.error('Submit Rating Error:', err);
      res.status(500).json({ message: 'Error submitting rating' });
    }
  });

  return router;
};