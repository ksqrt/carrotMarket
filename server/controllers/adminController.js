const router = require('express').Router();
const authService = require('../services/authService');
// const isAuth = require('../middlewares/isAuth');
// const isGuest = require('../middlewares/isGuest');
const { SECRET, COOKIE_NAME } = require('../config/config');
const jwt = require('jsonwebtoken');


router.post('/user', async (req, res) => {
    console.log('admin컨트롤ㄹ러러러러러');

    // try {
    //     let compressedImg = await productService.uploadImage(req.body.image);

    //     res.status(200).json({ success });
    // } catch (error) {
    //     res.status(500).json({ error });
    // }
})

module.exports = router;