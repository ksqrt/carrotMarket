const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT } = require('../config/config')
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    name: {
        type: String,
        trim: true,
        //required: 'Please fill a name. It can be your real one or a username.'
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        //required: 'Email address is required',
        //match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    // password api 연동시 삭제 예정
    password: {
        type: String,
        trim: true,
        //required: ['Password is required'],
        //minlength: [8, 'Password should be at least 8 characters long']
    },
    phoneNumber: {
        type: String,
        trim: true,
        required: ['Phone number is required']
    },
    gender: {
        type: String,
        trim: true,
        //default: 'Not specified'
    },
    avatar: {
        type: String,
        default: 'https://kr.object.ncloudstorage.com/ncp3/ghuPttFw_400x400.jpg'
    },
    createdSells: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    wishedProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    chatRooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChatRoom'
        }
    ],
    // 차단 유저 목록 
    blacklist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    // 매너 온도 기본 36.5
    mannertmp:{
            type:String,
            trim: true,
            default: 36.5
    }
});

userSchema.pre('save', async function (next) {
    let salt = await bcrypt.genSalt(SALT);
    let hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
})
userSchema.plugin(findOrCreate);


module.exports = mongoose.model('User', userSchema);