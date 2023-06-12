const Server = require('socket.io').Server;
const mongoose = require('mongoose');
const ChatRoom = require('../models/ChatRoom') // 채팅방 id, buyer, seller, conversation DB 연결


let io;
function Io(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"],
    }
  });

  console.log('Before io.use');

  io.on("connection", async (socket) => { //socket 변수 = socket.io에서 제공하는 것 
    try{
    console.log("User connected");

    // let chatdb = await ChatRoom.find().populate("buyer").populate("seller");

    socket.on("startChat", async ({buyerId, sellerId}) => { // 클라이언트에서 받을 내용 buyerId = buyer._id 될듯.
        
        if(buyerId === sellerId) {
            console.log("본인에게 채팅방 신청은 안됩니ㄷ");
            return;
        }

        let chatRoom = await ChatRoom.findOne({ buyer: buyerId, seller: sellerId }); // 구매자, 판매자 간 채팅방 있는지 확인
        
        if(!chatRoom) { // chatroom이 없을 때 if문 실행.
          chatRoom = new ChatRoom({ buyer: buyerId, seller: sellerId });
          await chatRoom.save();
        }
  
        socket.join(chatRoom._id.toString());
        socket.emit('startChat', { chatId: chatRoom._id.toString() });
    });

    socket.on("sendMessage", async ({chatId, senderId, message}) => {
        await ChatRoom.updateOne({ _id: chatId }, { $push: { conversation: { senderId, message } } });
        io.to(chatId).emit("newMessage", { senderId, message });
    });

    socket.on("disconnect", () => { // 인터넷 연결 끊어지면 작동
      console.log("disconnected");
    });

    socket.on("getUserConversations", async ({ userId }) => {

        let userChats = await ChatRoom.find({
            $or: [ // $or : 주어진 배열 내의 조건 중 하나라도 참이면 참으로 간주 buyer 또는 seller에 userId가 있는 경우에 참. 전부 가져옴.
                { 'buyer': userId },
                { 'seller': userId }
            ]
        }).populate("buyer").populate("seller");
        let checkedChats = userChats.map(x => ({ chats: x, isBuyer: (x.buyer._id == userId), myId: userId }));
        socket.emit('userConversations', checkedChats);
      });
    } catch(err) {
      console.log(err);
    }

});
return io;
}

module.exports = Io;



    // chatId = client-server에서 채팅방 식별해주는 id
    // chatRoom._id = db-server에서 채팅방 식별해주는 id, mongoose 자동 생성
    // socket.id = 사용자 고유 식별 id, socket.io에서 연결 마다 자동 생성, 일회용 값

    /*
const jwt = require('jsonwebtoken');
const { SECRET, COOKIE_NAME } = require('../config/config');

  io.use((socket, next) => { // socket.io의 미들웨어를 등록하는 메서드
    // jwt -> authService.js의 loginUser 참고할 것. authcontroller.js 의 /login 에 쿠키로 저장됨.
    console.log(socket.handshake.query.token); 
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, SECRET, (err, decoded) => {
        if (err) {
          console.log(err); // 오류 로깅
          console.log('SECRET: ', SECRET);
          socket.disconnect(); // 연결 종료
          return next(new Error('Authentication error'));
        }
        socket.decoded = decoded;
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }    
  })
  */