module.exports = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인/회원가입 하세요');
    }
};


// module.exports = (req, res, next) => {
//     if (req.user) {
//         return res.json({message: 'You are already logged-in'})
//     }

//     next();
// }