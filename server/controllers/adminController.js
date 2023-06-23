const {adminuser} = require('./../services/adminService');
const { Router } = require('express');
const router = require('express').Router();
const authService = require('../services/authService');
// const isAuth = require('../middlewares/isAuth');
// const isGuest = require('../middlewares/isGuest');
const { SECRET, COOKIE_NAME } = require('../config/config');
const User = require('../models/User');


// router.get('/user', async (req, res) => {
//     console.log('admin컨트롤ㄹ러러러러러');


//     // try {
//     //     let compressedImg = await productService.uploadImage(req.body.image);

//     //     res.status(200).json({ success });
//     // } catch (error) {
//     //     res.status(500).json({ error });
//     // }

// })


router.get('/user', async (req, res) => {

    // try {
    //     let product = await (await Product.findById(req.params.id)).toJSON()
    //     let seller = await (await User.findById(product.seller)).toJSON()
    //     product.addedAt = moment(product.addedAt).format('d MMM YYYY (dddd) HH:mm')
    //     let jsonRes = {
    //         ...product,
    //         name: seller.name,
    //         phoneNumber: seller.phoneNumber,
    //         email: seller.email,
    //         createdSells: seller.createdSells.length,
    //         avatar: seller.avatar,
    //         sellerId: seller._id,
    //         isAuth: false
    //     }
    //     if (req.user) {
    //         let user = await User.findById(req.user._id)
    //         jsonRes.isSeller = Boolean(req.user._id == product.seller);
    //         jsonRes.isWished = user.wishedProducts.includes(req.params.id)
    //         jsonRes.isAuth = true
    //     }
    //     res.status(200).json(jsonRes);
    // } catch (error) {
    //     res.status(500).json({ message: error.message })
    // }

    try{
        const users = await User.find();
        // console.log('zz',users);
        res.status(200).json(users);
    }
    catch(err){
        console.log(err);
    }
})

router.delete('/deleteuser/:id', async (req, res) => {
    
    try{
        console.log('컨트롤러',req.body);
        console.log('네임값',req.body.deleteUser);
        User.deleteOne({ name: { $in: req.body.deleteUser } }).exec();
        console.log('삭제완료');
    }
    catch(err){
        console.log(err);
    }
})


module.exports = router;