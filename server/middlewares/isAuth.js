module.exports = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다')
        res.redirect(`/?error=${message}`);
    }
};

// module.exports = (req, res, next) => {
//     if(!req.user) {
//         return res.status(401).json({message: 'You should sign in first!'})
//     }
//     next();
// }