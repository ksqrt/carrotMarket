const { Router } = require('express');
const router = Router();
const { cloudinary } = require('../config/cloudinary');
const isAuth = require('../middlewares/isAuth')
const Product = require('../models/Product');
const User = require('../models/User');
const moment = require('moment');
const Review = require('../models/Review');

const productService = require('../services/productService');

// router.use(express.json()); // JSON 파싱 미들웨어 추가


router.post('/create', async (req, res) => {
    const { id, content } = req.body;
  
    try {
      const review = new Review({
        id,
        content
      });
  
      await review.save();
      res.status(201).json(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  });

  // Get reviews by ID
router.get('/find/:id', async (req, res) => {
    try {
      const reviews = await Review.find({ id: req.params.id });
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
  });
  
  module.exports = router;