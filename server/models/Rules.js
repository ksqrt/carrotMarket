const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    rules:{
        type: String,
        default: 'user'
    }
})
// id에 따른 user 와 admin으로 나뉠 예정
// user는 기본 사용자이고, admin은 관리자용임.
module.exports = mongoose.model('Rules',rulesSchema);