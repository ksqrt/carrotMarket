const {adminuser} = require('./../services/adminService');
const { Router } = require('express');
const router = require('express').Router();
const authService = require('../services/authService');
// const isAuth = require('../middlewares/isAuth');
// const isGuest = require('../middlewares/isGuest');
const { SECRET, COOKIE_NAME } = require('../config/config');
const User = require('../models/User');
const Product = require('../models/Product');


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
    // } catch (error) 
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
    try {
      const userNameToDelete = req.params.id;
      console.log('네임값', userNameToDelete);
  
      await User.updateMany(
        { name: '이정규' },
        { $pull: { report: { _id: userNameToDelete } } }   
      );

    //   await User.updateOne({report:userNameToDelete}, {$unset:{userName:1}});

      

      console.log(userNameToDelete);
  
      await User.deleteOne({ _id: userNameToDelete });
  
      console.log('삭제완료');
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

router.get('/userCount', async (req, res) => {

    try{
       console.log('userCount');
       const userCount = await User.find();
       res.status(200).json(userCount);
    }
    catch(err){
        console.log(err);
    }
})



router.get('/productCount', async (req, res) => {

    try{
       console.log('productCount');
       const productCount = await Product.find();
       console.log(productCount);
       res.status(200).json(productCount);
       
    }
    catch(err){
        console.log(err);
    }
})

router.get('/adminProduct', async (req, res) => {

    try{
       const adminProducts = await Product.find();
       console.log(adminProducts,'컨트롤러찍히냐');
       res.status(200).json(adminProducts);
    }
    catch(err){
        console.log(err);
    }
})


router.delete('/deleteProduct/:productId', async (req, res) => {

    try{
       console.log('삭제컨트롤러');
       console.log(req.params.productId);
       await Product.findByIdAndDelete(req.params.productId);

    }
    catch(err){
        console.log(err);
    }
})


// router.get('/getAllProducts', async (req, res) => {

//     try{
//        const adminProduct = await Product.find();
//        console.log('대시보드',adminProduct)
//        res.status(200).json(adminProduct);
//     }
//     catch(err){
//         console.log(err);
//     }
// })







module.exports = router;


