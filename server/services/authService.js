const User = require('../models/User');
const bcrypt = require('bcrypt'); //bcrypt 모듈은 비밀번호 해시화(암호화)를 위한 함수 제공
const jwt = require('jsonwebtoken'); 
//JSON Web Token(JWT)을 생성할 때 사용되는 메서드 
//- 사용자 데이터와 비밀키(SECRET)를 기반으로 JWT를 생성
const { SECRET } = require('../config/config');

async function findorcreate(user) {

  const findBy = { email: user.email, provider: user.provider };
  console.log(findBy);

  let checkUser = await User.findOne(findBy);
  console.log(checkUser);

  if (checkUser) {
    let token = jwt.sign({ _id: checkUser._id, email: checkUser.email, name: checkUser.name, provider: checkUser.provider, role: checkUser.role, createdSells: checkUser.createdSells.length, avatar: checkUser.avatar }, SECRET);
    return token; 

  } 
  
  if (!checkUser) {
    const onCreate = { email: user.email, name: user.name, password: user.password, provider: user.provider };
  
    let newUser = await new User(onCreate).save();
    // await newUser.save();
    
    let token = jwt.sign({ _id: newUser._id, email: newUser.email, name: newUser.name, provider: user.provider, role: newUser.role, createdSells: newUser.createdSells.length, avatar: newUser.avatar }, SECRET);
    return token;

  }
}

  async function registerUser(userData) {
    let { email, name, password, repeatPassword } = userData;
    let errors = [];
    let checkUser = await User.findOne({ email });
    if (checkUser) errors.push('이미 사용중인 이메일입니다.');
    if (name.length < 2 || name.length > 10) errors.push('이름은 최소 2자에서 최대 10자입니다.')
    // if (/(\+)?(359|0)8[789]\d{1}(|-| )\d{3}(|-| )\d{3}/.test(phoneNumber) == false) errors.push('Phone number should be a valid BG number; ' );
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) == false) errors.push("이메일을 입력해주세요." );
    if (password !== repeatPassword) errors.push("비밀번호가 일치하지 않습니다." );
    if (password.length < 8) errors.push("비밀번호는 최소 8자이상 입력해주세요. " );
    if (password.length > 20) errors.push("비밀번호는 최대 20자입니다." );
    if (errors.length >= 1) throw {message: [errors]}
    
    let user = new User(userData);
    return await user.save();
  }
  
async function loginUser({ email, password }) {
  let user = await User.findOne({ email });
  if (!user) throw { message: 'Invalid email or password' };

  let hasValidPass = await bcrypt.compare(password, user.password);
  if (!hasValidPass) throw { message: "Invalid email or password" }

  let token = jwt.sign({ _id: user._id, email: user.email, phoneNumber: user.phoneNumber, createdSells: user.createdSells.length, avatar: user.avatar }, SECRET);
  return token;
}


async function getUser(id) {
    return await User.findById(id).lean()
}

module.exports = {
  findorcreate,
  registerUser,
  loginUser,
  getUser
}