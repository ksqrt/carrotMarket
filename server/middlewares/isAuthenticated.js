//Passport가 req 객체에 추가해주는 req.isAuthenticated 메서드를 사용
//로그인 된 사용자와 아닌 사용자를 구분해서 라우터 접근 권한을 제어하는 미들웨어

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인/회원가입 하세요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다')
        res.redirect(`/?error=${message}`);
    }
};