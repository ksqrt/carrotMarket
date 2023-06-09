const passport = require('passport');
const router = require('express').Router();

const {isLoggedIn, isNotLoggedIn} = require('../middlewares/isAuthenticated');

//GET /auth/kakao
//passportStrategy 수행 - 카카오 로그인창으로 리다이렉트
router.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));

//GET /auth/kakao/callback
//카카오 로그인창에서 성공여부 결과를 받아 passportStrategy 다시 수행
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?loginError=카카오 로그인 실패'
}), (req, res) => {
    res.redirect('/'); //로그인 성공 시 메인으로 이동
});

//GET /auth/logout
//Passport.js의 'req' 객체에 포함된 logout()메서드는 현재 로그인된 사용자를 로그아웃 처리하고 세션을 지움
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// router.get('/logout', isLoggedIn) = (req, res) => {
//     req.logout(() => {
//         res.redirect('/');
//     });
// };

// router.get('/logout', isLoggedIn, logout);

// exports.logout = (req, res) => {
//     req.logout(() => {
//         res.redirect('/');
//     });
// };

module.exports = router;