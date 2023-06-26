const router = require('express').Router();
const authService = require('../services/authService');
// const isAuth = require('../middlewares/isAuth');
// const isGuest = require('../middlewares/isGuest');
const jwt = require('jsonwebtoken'); 
const {sendEmail} = require('../middlewares/mail')

router.post('/snsLogin', (req, res) => {
    // console.log(req.body);
    authService.findorcreate(req.body)
        .then(token => {
            jwt.verify(token, process.env.REACT_APP_SECRET, (err, decoded) => {
                if (err) {
                    res.clearCookie(process.env.REACT_APP_COOKIE_NAME);
                } else {
                    req.user = decoded;     
                    res
                        .status(200)
                        .cookie(process.env.REACT_APP_COOKIE_NAME, token, { sameSite: 'none', secure: true, httpOnly: true })
                        .json({ user: decoded })
                }
            })
        })
        .catch(error => res.status(500).json({ error: error }))     
});

router.post('/register', async (req, res) => {
    try {
        let createdUser = await authService.registerUser(req.body);
        res.status(201).json({ _id: createdUser._id });
    } catch (error) {
        console.log(error)
        res.status(404).json({ error: error.message })
    }
});

router.post('/sendEmail', (req, res) => {
    // console.log(req.body)
    sendEmail(req.body.email, req.body.auth)
    return res.status(200).json({
        success: true
    })
})

router.post('/login', (req, res) => {
    authService.loginUser(req.body)
        .then(token => {
            jwt.verify(token, process.env.REACT_APP_SECRET, (err, decoded) => {
                if (err) {
                    res.clearCookie(process.env.REACT_APP_COOKIE_NAME);
                } else {
                    req.user = decoded;
                    res
                        .status(200)
                        .cookie(process.env.REACT_APP_COOKIE_NAME, token, { sameSite: 'none', secure: true, httpOnly: true })
                        .json({ user: decoded })
                }
            })
        })
        .catch(error => res.status(500).json({ error: error }))
});
  
router.get('/logout', (req, res) => {
    res.clearCookie(process.env.REACT_APP_COOKIE_NAME);
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