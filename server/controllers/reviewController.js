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
  let review = req.body;
  console.log(review);

  let content = req.body.content;
    try {
      let review = new Review({
            content:content
      })

      await review.save()
  
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: err.message })
    }

});

module.exports = router;
