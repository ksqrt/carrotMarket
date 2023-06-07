const User = require('../models/User');
const bcrypt = require('bcrypt'); //bcrypt 모듈은 비밀번호 해시화(암호화)를 위한 함수 제공
const jwt = require('jsonwebtoken'); 
//JSON Web Token(JWT)을 생성할 때 사용되는 메서드 
//- 사용자 데이터와 비밀키(SECRET)를 기반으로 JWT를 생성
const { SECRET } = require('../config/config');

async function registerUser(userData) {
    let { name, email, gender, phoneNumber, password, repeatPassword } = userData;
    let errors = [];
    let checkUser = await User.findOne({ email });
    if (checkUser) errors.push('This email address is already in use; ');
    if (name.length < 3 || name.length > 50) errors.push('Name should be at least 3 characters long and max 50 characters long; ')
    if (/(\+)?(359|0)8[789]\d{1}(|-| )\d{3}(|-| )\d{3}/.test(phoneNumber) == false) errors.push('Phone number should be a valid BG number; ' );
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) == false) errors.push("Please fill a valid email address; " );
    if (password !== repeatPassword) errors.push("Passwords should match; " );
    if (password.length < 8) errors.push("Password should be at least 8 characters long; " );
    if (password.length > 20) errors.push("Password should be at max 20 characters long; " );
    if (errors.length >= 1) throw {message: [errors]} //error 메시지가 존재하는 경우 출력
    
    let user = new User(userData);
    return await user.save();
}

async function loginUser({ email, password }) {
    let user = await User.findOne({ email });
    if (!user) throw { message: 'Invalid email or password' };

    let hasValidPass = await bcrypt.compare(password, user.password);
    if (!hasValidPass) throw { message: "Invalid email or password" }
    //bcrypt 라이브러리의 compare 함수(입력한 psw, db에 저장된 psw) - 비밀번호를 해시화된 비밀번호와 비교하여 일치 여부 확인
    //비동기 함수이므로 await 키워드를 사용해 비동기 작업 완료 때 까지 대기

    let token = jwt.sign({ _id: user._id, email: user.email, phoneNumber: user.phoneNumber, createdSells: user.createdSells.length, avatar: user.avatar }, SECRET);
    //사용자의 ID 등을 페이로드로 사용. 페이로드는 플레임 형태로 표현 됨. == JWT에 포함된 정보
    //페이로드와 비밀 키를 기반으로 JWT를 생성하고, 생성된 JWT를 반환
    //이 JWT는 클라이언트에게 전달되어 인증과정에 사용
    return token;
    //
}

async function getUser(id) {
    return await User.findById(id).lean()
}

module.exports = {
    registerUser,
    loginUser,
    getUser
}