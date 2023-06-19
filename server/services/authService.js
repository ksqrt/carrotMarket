const User = require('../models/User');
const bcrypt = require('bcrypt'); //bcrypt 모듈은 비밀번호 해시화(암호화)를 위한 함수 제공
const jwt = require('jsonwebtoken'); 
//JSON Web Token(JWT)을 생성할 때 사용되는 메서드 
//- 사용자 데이터와 비밀키(SECRET)를 기반으로 JWT를 생성
const { SECRET } = require('../config/config');

async function snsLoginUser({ email, name, provider }) {
  let users = await User.find({ email }).exec();

  if (users.length === 0) {
    // 사용자가 없는 경우
    const user = new User({ email, name, provider });
    await user.save();

    const token = jwt.sign(
      { _id: user._id, email: user.email, phoneNumber: user.phoneNumber, createdSells: user.createdSells.length, avatar: user.avatar },
      SECRET
    );

    return token;
  }

  // 동일한 이메일을 가진 사용자들 중에서 공급자(provider)가 일치하는 사용자를 찾습니다.
  const matchingUser = users.find(user => user.provider === provider);

  if (matchingUser) {
    // 일치하는 사용자가 이미 존재하는 경우
    const token = jwt.sign(
      { _id: matchingUser._id, email: matchingUser.email, phoneNumber: matchingUser.phoneNumber, createdSells: matchingUser.createdSells.length, avatar: matchingUser.avatar },
      SECRET
    );

    return token;
  }

  // 동일한 이메일을 가진 사용자가 있지만 공급자(provider)가 일치하는 사용자가 없는 경우
  const newUser = new User({ email, name, provider });
  await newUser.save();

  const token = jwt.sign(
    { _id: newUser._id, email: newUser.email, phoneNumber: newUser.phoneNumber, createdSells: newUser.createdSells.length, avatar: newUser.avatar },
    SECRET
  );

  return token;
}

// async function snsLoginUser({ email, name, provider }) {
//   let user = await Product.find({ email: email, provider: provider })
//   if (!user) {
//     let user = new User({ email, name, provider });
//     return await user.save();
//   }

//   let token = jwt.sign({ _id: user._id, email: user.email, name: user.name, provider: user.provider, phoneNumber: user.phoneNumber, createdSells: user.createdSells.length, avatar: user.avatar, role: user.role }, SECRET);
//   return token;
// }

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
    snsLoginUser,
    registerUser,
    loginUser,
    getUser
}