// Mongoose 라이브러리를 사용하여 MongoDB 사용
const mongoose = require('mongoose');
const Product = require('./Product');

// chatRoom 스키마를 생성 및 구조 정의
const chatRoomSchema = new mongoose.Schema({
    
    //  각 채팅방은 고유한 id를 가짐
    id: mongoose.Types.ObjectId,

    // buyer, seller 각각 고유한 objectId 값을 가짐, User.js 정보를 참조함.
    buyer: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    seller: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    // 대화 내용을 배열 형태로 저장함 / 각 메세지 보낸 사람의 ID는 User 참조.
    conversation: [{
        senderId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: false // senderId가 없는 경우 system으로 표시
        },
        message: {
            type: String,
            trim: true
        },
        sentAt: {  // 메시지에 타임스탬프를 추가
            type: Date,
            default: Date.now  // 현재 시간을 기본값으로 설정
        },
        location: { // 위치 정보 필드 추가
            lat: Number,
            lng: Number,
            address: String
        },
    }],
    // Product Id 고유 id
    product:{
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },

    appointmentDate: {
        type: Date, // 약속 잡기
        required: false
    },
    appointmentCheck: {
        type:Boolean,
        default:false
    },
    notificationMessages: {
        type: Number,
        default:0
    },
});

// chatRoomSchema를 기반으로 ChatRoom 모델을 생성 후 export
module.exports = mongoose.model('ChatRoom', chatRoomSchema);