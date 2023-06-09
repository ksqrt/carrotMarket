const Server = require('socket.io').Server;
const mongoose = require('mongoose');
const ChatRoom = require('../models/ChatRoom') // 채팅방 id, buyer, seller, conversation DB 연결

let io;
function Io(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", async (socket) => {
    console.log("User connected");

    // let chatdb = await ChatRoom.find().populate("buyer").populate("seller");

    socket.on("startChat", async ({buyerId, sellerId}) => { // 클라이언트에서 받을 내용 buyerId = buyer._id 될듯.
        let chatRoom = await ChatRoom.findOne({ buyer: buyerId, seller: sellerId }); // 구매자, 판매자 간 채팅방 있는지 확인
        
        if(!chatRoom) { // chatroom이 없을 때 if문 실행.
          chatRoom = new ChatRoom({ buyer: buyerId, seller: sellerId });
          await chatRoom.save();
        }
  
        socket.join(chatRoom._id.toString());
    });
    // chatId = client-server에서 채팅방 식별해주는 id
    // chatRoom._id = db-server에서 채팅방 식별해주는 id, mongoose 자동 생성
    // socket.id = 사용자 고유 식별 id, socket.io에서 연결 마다 자동 생성, 일회용 값
    socket.on("sendMessage", async ({chatId, senderId, message}) => {
        await ChatRoom.updateOne({ _id: chatId }, { $push: { conversation: { senderId, message } } });
        io.to(chatId).emit("newMessage", { senderId, message });
    });

    socket.on("disconnect", () => { // 인터넷 연결 끊어지면 작동
      console.log("disconnected");
    });
});
return io;
}

module.exports = Io;