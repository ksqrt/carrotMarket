
const { Router } = require('express');
const router = Router();
const { cloudinary } = require('../config/cloudinary');
const User = require('../models/User');
// const isAuth = require('../middlewares/isAuth')
const productService = require('../services/productService');
const userService = require('../services/userService');

// 사용자 프로필을 수정하는 엔드포인트
router.patch('/edit-profile/:id', async (req, res) => {
    //TODO: 이 부분 재작성하기 
    // console.log(req.body);
    let { name,avatar } = req.body;
    // console.log(name);
    // console.log(phoneNumber);
    // console.log(email);
    // console.log(avatar);

    try {
        // let errors = [];
        // let checkUser = await User.findOne({ email });

        // if (checkUser && checkUser._id.toString() !== req.user._id.toString()) errors.push('This email address is already in use; ');
        // if (name.length < 3 || name.length > 50) errors.push('Name should be at least 3 characters long and max 50 characters long; ')
        // if (/(\+)?(359|0)8[789]\d{1}(|-| )\d{3}(|-| )\d{3}/.test(phoneNumber) == false) errors.push('Phone number should be a valid BG number; ');
        // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) == false) errors.push("Please fill a valid email address; ");

    //     if (req.body.avatar) {
    //         if (!req.body.avatar.includes('image')) errors.push('The uploaded file should be an image; ');
    //     }

    let compressedImg = await productService.uploadImage(req.body.avatar);
    await userService.edit(req.params.id, { name, avatar: compressedImg });
    res.status(201).json({ message: 'Updated!', avatar: compressedImg });

    //     if (errors.length >= 1) throw { message: [errors] };

    //     if (req.body.avatar) {
    //         let compressedImg = await productService.uploadImage(req.body.avatar);
    //         await userService.edit(req.params.id, { name, phoneNumber, email, avatar: compressedImg });
    //         res.status(201).json({ message: 'Updated!', avatar: compressedImg });
    //     } else {
    //         await userService.edit(req.params.id, { name, phoneNumber, email });
    //         res.status(201).json({ message: 'Updated!' });
    //     }
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
})

// 사용자 ID로 사용자 정보를 가져오는 엔드포인트
router.get('/getUserById/:id', async (req, res) => {
    try {
        let user = await userService.getUserById(req.params.id);
        let jsonRes = {
            _id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber,
            totalSells: user.createdSells.length, avatar: user.avatar,
            mannertmp: user.mannertmp
            // isMe: req.user._id == req.params.id
        }
        res.status(200).json({user: jsonRes});
    } catch (error) {
        res.status(500).json({ error });
    }
})

// 사용자 ID로 사용자 정보를 가져오는 엔드포인트
router.get('/getUserName/:id', async (req, res) => {
    try {
        let user = await userService.getUserById(req.params.id);
        let jsonRes = {
            name: user.name
        }
        res.status(200).json({ user: jsonRes });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// "매너 점수"를 업데이트하는 엔드포인트
router.post('/updatemanner/:id', async (req, res) => {
    console.log('fff');
    console.log(req.body.mannerScoreChange);
    try {
      const { mannerScoreChange } = req.body; // Retrieve mannerScoreChange from req.body
      const numericMannerScoreChange = Number(mannerScoreChange); // Convert mannerScoreChange to a numeric value
  
      if (isNaN(numericMannerScoreChange)) {
        throw new Error('Invalid mannerScoreChange'); // Throw an error if the converted value is NaN
      }
  
      // Retrieve user data from the user service based on the provided ID
      const user = await userService.getUserById2(req.params.id);
  
      // Update the "매너 점수" based on the provided manner score change
      user.mannertmp += numericMannerScoreChange;
      await user.save();
  
      res.status(200).json({ message: '매너 점수가 업데이트되었습니다.' });
    } catch (error) {
      console.error('Error updating MannerTemperature:', error);
      res.status(500).json({ error: 'Failed to update MannerTemperature' });
    }
  });

  //유저 정보 삭제
  router.delete('/delete/:id', async (req, res) => {
    try {
        let user = await userService.getUserById(req.params.id);

        await User.findOneAndDelete({ _id: user._id });
        res.clearCookie(process.env.REACT_APP_COOKIE_NAME);
        res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '회원 탈퇴가 정상적으로 진행되지 않았습니다. 다시 시도해주세요.' })
    }
  })

module.exports = router;


