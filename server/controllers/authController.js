const passport = require('passport');
const router = require('express').Router();

const isAuth = require('../middlewares/isAuth');
const isGuest = require('../middlewares/isGuest');

//GET /auth/kakao
//passportStrategy 수행 - 카카오 로그인창으로 리다이렉트
router.get('/kakao', isAuth, passport.authenticate('kakao'));

//GET /auth/kakao/callback
//카카오 로그인창에서 성공여부 결과를 받아 passportStrategy 다시 수행
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?loginError=카카오 로그인 실패'
}), (req, res) => {
    res.redirect('/'); //로그인 성공 시 메인으로 이동
});

//GET /auth/logout
//Passport.js의 'req' 객체에 포함된 logout()메서드는 현재 로그인된 사용자를 로그아웃 처리하고 세션을 지움
router.get('/logout', isGuest, (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

//google
router.get('/google', passport.authenticate('google', {
    scope: ["profile"]
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/');
});

router.get('/getUser', async (req, res) => {
    if (req.user) {
        let user = await authService.getUser(req.user._id);
        res.status(200).json({user: {_id: user._id, name: user.name, email: user.email, 
            phoneNumber: user.phoneNumber, createdSells: user.createdSells.length, avatar: user.avatar}})
    } else {
        res.status(200).json({message: "Not loged in"})
    }
})

module.exports = router;

// const router = require('express').Router();
// const authService = require('../services/authService');
// // const isAuth = require('../middlewares/isAuth');
// // const isGuest = require('../middlewares/isGuest');
// const { SECRET, COOKIE_NAME } = require('../config/config');
// const jwt = require('jsonwebtoken');

// router.post('/register', async (req, res) => {
//     try {
//         let createdUser = await authService.registerUser(req.body); //시용자 등록 처리
//         res.status(201).json({ _id: createdUser._id }); 
//         //HTTP 상태 코드 201(Create) - 새로 생성된 사용자 ID를 JSON 형식으로 응답
//     } catch (error) {
//         console.log(error)
//         res.status(404).json({ error: error.message })
//         //HTTP 상태 코드 404(Not Found) - 오류 메시지를 JSON 형식으로 응답
//     }
// });

// router.post('/login', (req, res) => {
//     authService.loginUser(req.body) //로그인 처리 후 토큰 반환
//         .then(token => {
//             jwt.verify(token, SECRET, (err, decoded) => {
//             //jwt.verify - 토큰을 검증하고 결과를 콜백 함수로 전달.
//                 if (err) {
//                     res.clearCookie(COOKIE_NAME); //로그인 실패인 경우 쿠키 제거
//                 } else {
//                     req.user = decoded; //사용자 정보를 요청 객체에 저장
//                     res
//                         .status(200) //HTTP 상태 코드 200(OK) - 쿠키 설정, 사용자 정보 JSON 형식으로 응답
//                         .cookie(COOKIE_NAME, token, { sameSite: 'none', secure: true, httpOnly: true })
//                         //안전한 쿠키 전송을 위한 설정
//                         .json({ user: decoded })
//                 }
//             })
//         })
//         .catch(error => res.status(500).json({ error: error }))
// });

// router.get('/logout', (req, res) => {
//     res.clearCookie(COOKIE_NAME);
//     res.status(200).json({ message: 'Successfully logged out' })
// });

// module.exports = router;