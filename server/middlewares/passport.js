const passport = require('passport');
const kakao = require('../services/passportStrategy');
const User = require('../models/User');

module.exports = () => {
    passport.serializeUser((user, done) => { //로그인 시 실행 - 세션에 저장할 데이터 결정하는 메서드
        done(null, user.id); //null: 에러가 발생할 때 사용, user.id: 저장하고 싶은 데이터
    });

    passport.deserializeUser((id, done) => { //각 요청마다 실행. done 함수의 두 번째 인수를 매개변수로 사용
        User.findOne({where: {id}}) //사용자 정보 조회
            .then(user => done(null, user)) //req.user에 저장
            .catch(err => done(err));
    });

    kakao();
}