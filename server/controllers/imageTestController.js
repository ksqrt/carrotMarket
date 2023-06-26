const router = require('express').Router();

// const isAuth = require('../middlewares/isAuth');
// const isGuest = require('../middlewares/isGuest');
const jwt = require('jsonwebtoken');
const productService = require('../services/productService');


router.post('/', async (req, res) => {
    try {


        let compressedImg = await productService.uploadImage(req.body.image);

        res.status(200).json({ success });
    } catch (error) {
        res.status(500).json({ error });
    }
})

module.exports = router;