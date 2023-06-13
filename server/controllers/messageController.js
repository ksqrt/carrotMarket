/*
const router = require('express').Router(); // Express 라우터를 초기화
const ChatRoom = require('../models/ChatRoom') // server/models/ChatRoom.js에서 만든 ChatRoom 모델을 import
const User = require('../models/User'); // server/models/User.js에서 만든 User 모델을 import
const messageService = require('../services/messageService') // server/services/messageService.js 가져옴

router.post('/createChatRoom', async (req, res) => { // 채팅방을 만드는 라우트 /createChatRoom URL로 post요청

    const { message, receiver } = req.body; // client messagesData.jsml body에서 메시지와 수신자를 가져옴
    try {
        let chatRoom = await messageService.createChatRoom(req.user._id, receiver) // messageService.js의 createChatRoom 함수 사용.
        await ChatRoom.updateOne({ _id: chatRoom._id }, { $push: { conversation: { senderId: req.user._id, message } } }) // 새로운 메시지를 채팅방 대화에 배열에 새로운 요소로 senderId: req.user._id, message 형태로 추가함.

        res.status(200).json({ messageId: chatRoom._id }) //chatRoom._id를 messageId 라고 함. 200 뜨면 json 형태로 chatroom._id 보냄.

    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/getUserConversations', async (req, res) => { // 사용자의 모든 대화를 가져오는 라우트 설정
    
    let allChats = await ChatRoom.find().populate("buyer").populate("seller"); // 모든 채팅방의 정보를 가져옴
    let userChats = allChats.filter(x => x.buyer._id == req.user._id || x.seller._id == req.user._id) // 현재 user._id가 참여한 채팅방만 filter해서 보여줌
    let checkedChats = userChats.map(x => ({ chats: x, isBuyer: (x.buyer._id == req.user._id), myId: req.user._id })) // 사용자가 구매자인지 판매자인지 확인 (isBuyer = 현재 사용자가 이 채팅방의 구매자인지 확인)
    res.status(200).json(checkedChats)
})

router.post('/sendMessage', async (req, res) => {
    const { chatId, message } = req.body;     // client 요청 body에서 메시지와 chatId를 가져옴
    let chat = await ChatRoom.updateOne({ _id: chatId }, { $push: { conversation: { senderId: req.user._id, message } } }) // chatId 와 같은 _id를 찾고 해당 chatroom의 conversation의 내용을 업데이트 (senderId: req.user._id, message)라는 새 요소 추가) 
    
    console.log(chat)
    res.status(200).json({ sender: req.user._id })
})


module.exports = router;
*/

/* 예시
{
    chats: {
        _id: "chat1",
        buyer: {_id: "1", name: "Alice"},
        seller: {_id: "2", name: "Bob"},
        conversation: []
    },
    isBuyer: true,
    myId: "1"
},
*/
//200 응답 설정 -> 응답은 checkedChats json 형태로
