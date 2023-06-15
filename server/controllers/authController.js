

const router = require('express').Router();
const authService = require('../services/authService');
// const isAuth = require('../middlewares/isAuth');
// const isGuest = require('../middlewares/isGuest');
const { SECRET, COOKIE_NAME } = require('../config/config');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        let createdUser = await authService.registerUser(req.body); //시용자 등록 처리
        res.status(201).json({ _id: createdUser._id }); 
        //HTTP 상태 코드 201(Create) - 새로 생성된 사용자 ID를 JSON 형식으로 응답
    } catch (error) {
        console.log(error)
        res.status(404).json({ error: error.message })
        //HTTP 상태 코드 404(Not Found) - 오류 메시지를 JSON 형식으로 응답
    }
});

router.post('/login', (req, res) => {
    authService.loginUser(req.body) // 로그인 처리 후 토큰 반환
      .then(token => {
        jwt.verify(token, SECRET, (err, decoded) => {
          if (err) {
            res.clearCookie(COOKIE_NAME); // 로그인 실패인 경우 쿠키 제거
            res.status(401).json({ error: 'Authentication failed' }); // 인증 실패 응답
          } else {
            req.user = decoded; // 사용자 정보를 요청 객체에 저장
            res
              .status(200)
              .cookie(COOKIE_NAME, token, { sameSite: 'none', secure: true, httpOnly: true })
              .json({ user: decoded });
          }
        });
      })
      .catch(error => res.status(500).json({ error: error.message }));
  });
  

router.get('/getUser', async (req, res) => {
    if (req.user) {
        const email = req.user.email; // 토큰에서 이메일 정보 추출

        // 이메일을 사용하여 사용자 정보 가져오기
        // 예시: 이메일을 기반으로 사용자를 검색하고 정보를 가져오는 함수를 사용한다고 가정합니다.
        const user = await authService.getUserByEmail(email);

        if (user) {
            res.status(200).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    createdSells: user.createdSells.length,
                    avatar: user.avatar
                }
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } else {
        res.status(401).json({ message: "Not logged in" });
    }
});


// router.get('/getUser', async (req, res) => {
//     if (req.user) {
//         let user = await authService.getUser(req.user._id);
//         res.status(200).json({user: {_id: user._id, name: user.name, email: user.email, 
//             phoneNumber: user.phoneNumber, createdSells: user.createdSells.length, avatar: user.avatar}})
//     } else {
//         res.status(200).json({message: "Not loged in"})
//     }
// })
    
// router.get('/logout', (req, res) => {
//     res.clearCookie(COOKIE_NAME);
//     res.status(200).json({ message: 'Successfully logged out' })
// });

// router.get('/getUser', async (req, res) => {
//     if (req.user) {
//         let user = await authService.getUser(req.user._id);
//         res.status(200).json({user: {_id: user._id, name: user.name, email: user.email, 
//             phoneNumber: user.phoneNumber, createdSells: user.createdSells.length, avatar: user.avatar}})
//     } else {
//         res.status(200).json({message: "Not loged in"})
//     }
// });

module.exports = router;