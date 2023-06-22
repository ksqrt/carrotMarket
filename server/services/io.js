const Server = require('socket.io').Server;
const ChatRoom = require('../models/ChatRoom') // 채팅방 id, buyer, seller, conversation DB 연결
const mongoose = require('mongoose');

let io;
function Io(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://default-client-service-c63f5-17896865-377617edafd0.kr.lb.naverncp.com"
      ],
      methods: ["GET", "POST"],
    }
  });
  

  io.on("connection", (socket) => { //socket 변수 = socket.io에서 제공하는 것 
    console.log("socket.io connected");

    
    socket.on("startChat", async ({buyerId, sellerId, productId}) => { // 클라이언트에서 받을 내용 buyerId = buyer._id 될듯.
      let chatRoom = buyerId !== sellerId && await ChatRoom.findOne({ buyer: buyerId, seller: sellerId, product: productId }) || new ChatRoom({ buyer: buyerId, seller: sellerId, product: productId });
      await chatRoom.save();
      socket.join(chatRoom._id.toString());
      socket.emit('startChat', { chatId: chatRoom._id.toString() });
    });

    socket.on("sendMessage", async ({chatId, senderId, message, location}) => { // chatId, senderId, message 인자와 함께 이벤트를 받았을 때 실행됨.
      const sentAt = new mongoose.Types.ObjectId(); // MongoDB의 ObjectId를 사용하여 서버 시간을 가져옵니다. 
      const _id = new mongoose.Types.ObjectId();
      const newMessage = { _id, senderId, message, sentAt: sentAt.getTimestamp(), location };
      await ChatRoom.updateOne({ _id: chatId }, { $push: { conversation: newMessage } });
      
      console.log('3. io.js, sendMessage', newMessage );
      io.emit("newMessage", newMessage); // senderId, message, sentAt 인자 제공 필요
      console.log('4. io.js, newMessage');
    });

    socket.on("getUserConversations", async ({ userId }) => {
      // $or : 주어진 배열 내의 조건 중 하나라도 참이면 참으로 간주 buyer 또는 seller에 userId가 있는 경우에 참. 전부 가져옴.
      let userChats = await ChatRoom.find({ $or: [ { 'buyer': userId }, { 'seller': userId } ] }).populate("buyer").populate("seller").populate("conversation").populate("product");
      socket.emit('userConversations', userChats.map(x => ({ chats: x, isBuyer: (x.buyer._id == userId), myId: userId })));
    });
  
    socket.on("disconnect", () => console.log("disconnected"));
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