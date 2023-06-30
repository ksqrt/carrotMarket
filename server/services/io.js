// const router = require('express').Router();
const Server = require('socket.io').Server;
const ChatRoom = require('../models/ChatRoom') // 채팅방 id, buyer, seller, conversation DB 연결
const mongoose = require('mongoose');
const User = require('../models/User'); 
const Product = require('../models/Product'); 
const productService = require('../services/productService');

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
  
  let activeUsers = {}; // 채팅방:사용자 추적 , socket.to를 썼다면...

  io.on("connection", (socket) => { //socket 변수 = socket.io에서 제공하는 것 
    // console.log("socket.io connected");

    socket.on('enterChatRoom', ({chatId, userId}) => {
      activeUsers[userId] = chatId;
      socket.userId = userId;
      // console.log("채팅방 안에 있냐? : ", activeUsers, socket.userId);

    });

    socket.on('leaveChatRoom', ({userId}) => {
      console.log("사용자가 채팅방을 나감 : ", userId);
      if (userId in activeUsers) {
        delete activeUsers[userId];
      }
      console.log("현재 채팅방에 있는 사용자들: ", activeUsers);
  });

    socket.on("startChat", async ({buyerId, sellerId, productId}) => { // 클라이언트에서 받을 내용 buyerId = buyer._id 될듯.
      let chatRoom = buyerId !== sellerId && await ChatRoom.findOne({ buyer: buyerId, seller: sellerId, product: productId }) || new ChatRoom({ buyer: buyerId, seller: sellerId, product: productId });
      await chatRoom.save();
      socket.join(chatRoom._id.toString());
      socket.emit('startChat', { chatId: chatRoom._id.toString() });
    });

    socket.on("sendMessage", async ({chatId, senderId, message, location }) => { 
      const sentAt = new mongoose.Types.ObjectId(); //
      const _id = new mongoose.Types.ObjectId();
      const newMessage = { _id, senderId, message, sentAt: sentAt.getTimestamp(), location };
      
      const chatRoom = await ChatRoom.findOne({ _id: chatId });
      let NotificationIncrease = {};
      if (chatRoom.buyer.equals(senderId) && activeUsers[chatRoom.seller] !== chatId) { 
        NotificationIncrease = { notificationMessages_seller: 1 };
      } else if (chatRoom.seller.equals(senderId) && activeUsers[chatRoom.buyer] !== chatId) {  
        NotificationIncrease = { notificationMessages_buyer: 1 };
      }
      const updatedChatRoom = await ChatRoom.findOneAndUpdate({ _id: chatId },{ $push: { conversation: newMessage }, $inc: NotificationIncrease },{ new: true });      
      // const notificationMessages = updatedChatRoom.buyer.equals(senderId) ? updatedChatRoom.notificationMessages_seller : updatedChatRoom.notificationMessages_buyer;

      io.emit("newMessage", newMessage);
      if (chatRoom.buyer.equals(senderId)) { 
        io.emit("notificationChat", { chatId, notificationMessages: updatedChatRoom.notificationMessages_seller, senderId });
      } else if (chatRoom.seller.equals(senderId)) {  
        io.emit("notificationChat", { chatId, notificationMessages: updatedChatRoom.notificationMessages_buyer, senderId });
      }


      console.log("Sender ID: ", senderId);
      console.log("Chat Room Buyer ID: ", chatRoom.buyer);
      console.log("Chat Room Seller ID: ", chatRoom.seller);
      console.log("Notification Increase: ", NotificationIncrease);

    });


    socket.on("setAppointment", async ({chatId, appointmentDate }) => {
      await ChatRoom.updateOne({ _id: chatId }, { appointmentDate, appointmentCheck: false });
      io.emit("appointmentUpdated", { chatId, appointmentDate });
  });

    socket.on("appointmentCheck", async ({chatId, appointmentCheck }) => {
      await ChatRoom.updateOne({ _id: chatId }, { appointmentCheck });
      io.emit("appointmentChecked", { chatId, appointmentCheck });
  });

    socket.on("deleteAppointment", async ({chatId}) => {
      await ChatRoom.updateOne({_id:chatId}, {$set:{appointmentDate:null}});
      io.emit("deleteAppointmentUpdated", {chatId, appointmentDate:null});
    })

    socket.on("ReportMessage", async ({ reportedUserId, reason }) => {
      const reportedUser = await User.findById(reportedUserId);
      if (reportedUser) {
        // console.log(`Reported User ID: ${reportedUserId}`);
        await User.updateOne({ _id: '6495291bf3888864f425b039' },  { $push: { report: { userName: reportedUser.name, content: reason},},});
      }
    });


    socket.on("ExitRoom", async ({ chatId, userId }) => {
      console.log('exitRoom : ', chatId, userId);
      const chatRoom = await ChatRoom.findById(chatId);

      if (chatRoom.buyer && chatRoom.buyer.equals(userId)) {
        chatRoom.buyer = null;
      } else if (chatRoom.seller && chatRoom.seller.equals(userId)) {
        chatRoom.seller = null;
      }
    
      await chatRoom.save();
      
      if (!chatRoom.buyer && !chatRoom.seller) {
        await chatRoom.remove();
      }
    
      io.emit("userExitRoom", { chatId, userId });

    });


    socket.on("TradeComplete", async ({chatId, productId }) => {
      await Product.updateOne({ _id: productId }, { $set: { soldout: 'true' },});
      io.emit("TradeCompleted", { chatId, productId });
    });

    


    socket.on("getUserConversations", async ({ userId }) => {
      // $or : 주어진 배열 내의 조건 중 하나라도 참이면 참으로 간주 buyer 또는 seller에 userId가 있는 경우에 참. 전부 가져옴.
      let userChats = await ChatRoom.find({ $or: [ { 'buyer': userId }, { 'seller': userId } ] }).populate("buyer").populate("seller").populate("conversation").populate("product");
      socket.emit('userConversations', userChats.map(x => ({ 
        chats: x, 
        isBuyer: (x.buyer?._id == userId), 
        myId: userId, 
      })));    
    });
  
    socket.on("disconnect", () => {
      console.log("socket disconnected")
      delete activeUsers[socket.userId];
      // console.log("감? : ", activeUsers);

    });
    //차단하기
    socket.on("UserBlock", async ({blockId, myId99}) => {
      console.log(blockId + 'blockIdsocket');
      console.log(myId99 + 'myId99socket');
      await User.updateOne({ _id: myId99 }, { blacklist: blockId });
    });

  });
  return io;
}

module.exports = Io;
