const router = require('express').Router();
const authService = require('../services/authService');
// const isAuth = require('../middlewares/isAuth');
// const isGuest = require('../middlewares/isGuest');
const { SECRET, COOKIE_NAME } = require('../config/config');
const jwt = require('jsonwebtoken');

router.post('/snsLogin', (req, res) => {
    authService.snsLoginUser(req.body)
        .then(token => {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    res.clearCookie(COOKIE_NAME);
                } else {
                    req.user = decoded;
                    res
                        .status(200)
                        .cookie(COOKIE_NAME, token, { sameSite: 'none', secure: true, httpOnly: true })
                        .json({ user: decoded })
                }
            })
        })
        .catch(error => res.status(500).json({ error: error }))
});

router.post('/snsLogin', (req, res) => {
    authService.snsLoginUser(req.body)
        .then(token => {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    res.clearCookie(COOKIE_NAME);
                } else {
                    req.user = decoded;
                    res
                        .status(200)
                        .cookie(COOKIE_NAME, token, { sameSite: 'none', secure: true, httpOnly: true })
                        .json({ user: decoded })
                }
            })
        })
        .catch(error => res.status(500).json({ error: error }))
});

router.post('/login', (req, res) => {
    authService.loginUser(req.body)
        .then(token => {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    res.clearCookie(COOKIE_NAME);
                } else {
                    req.user = decoded;
                    res
                        .status(200)
                        .cookie(COOKIE_NAME, token, { sameSite: 'none', secure: true, httpOnly: true })
                        .json({ user: decoded })
                }
            })
        })
        .catch(error => res.status(500).json({ error: error }))
});
  
router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.status(200).json({ message: 'Successfully logged out' });
    
});

router.get('/getUser', async (req, res) => {
        if (req.user) {
            let user = await authService.getUser(req.user._id);
            res.status(200).json({user: {_id: user._id, name: user.name, email: user.email, 
                phoneNumber: user.phoneNumber, createdSells: user.createdSells.length, avatar: user.avatar}})
        } else {
            res.status(200).json({message: "Not loged in"})
        }
});  

module.exports = router;