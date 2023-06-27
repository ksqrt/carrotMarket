const jwt = require('jsonwebtoken');

const auth = () => {
    return (req, res, next) => {
        let token = req.cookies[process.env.REACT_APP_COOKIE_NAME];
        if (token) {
            jwt.verify(token, process.env.REACT_APP_SECRET, (err, decoded) => {
                if (err) {
                    res.clearCookie(process.env.REACT_APP_COOKIE_NAME);
                } else {
                    req.user = decoded;
                }
            })
        }
        next();
    }
}

module.exports = auth;