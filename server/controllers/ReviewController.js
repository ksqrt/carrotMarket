const { Router } = require('express');
const router = Router();
const { cloudinary } = require('../config/cloudinary');
const User = require('../models/User');
// const isAuth = require('../middlewares/isAuth')
const productService = require('../services/productService');
const userService = require('../services/userService');
const ReviewService = require('../services/ReviewService')
// 사용자 ID로 사용자 정보를 가져오는 엔드포인트
router.post('/review/create', async (req, res) => {
    console.log('여기오냐');
    try {
        let review = await ReviewService.createReview(req.body);

    } catch (error) {
        res.status(500).json({ error });
    }
})

module.exports = router;