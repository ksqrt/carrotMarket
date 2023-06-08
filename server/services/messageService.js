// server/models/ChatRoom.js에서 만든 ChatRoom 모델을 import
const ChatRoom = require('../models/ChatRoom')

// 새로운 채팅창 비동기로 생성
// 구매자, 판매자 매개변수 필요
async function createChatRoom(buyer, seller) {
    let chatRoom = new ChatRoom({ buyer, seller})

    console.log(chatRoom)
    /*
    {
        _id: 60c72b4f7f9b2a3d34f6eea0, 
        buyer: 60c72b4f7f9b2a3d34f6ee98, 
        seller: 60c72b4f7f9b2a3d34f6ee99, 
        conversation: [],
        __v: 0
    }
    */
   // db insert 또는 동일 chatRoom id인 경우 update
    return await chatRoom.save();
}

// createChatRoom export
module.exports = {
    createChatRoom
}