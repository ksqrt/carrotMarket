import { io as IO } from "socket.io-client";
import url from "../url.js";

export const initializeSocket = async () => {
  const socket = IO(url);

  socket.on('connect', () => {
    // console.log('Socket connected:', socket.id);
    });
  //console.log("Socket created:", socket);
  return socket;

};

//startChat: 채팅을 시작하는 함수입니다. socket.emit을 사용하여 startChat 이벤트와 buyerId, sellerId 정보를 서버로 전송합니다.
export const startChat = (socket, { buyerId, sellerId, productId}) => {
    console.log('StartChat function execution');
    socket.emit('startChat', { buyerId, sellerId, productId });
};

//sendMessage: 메시지를 전송하는 함수입니다. socket.emit을 사용하여 sendMessage 이벤트와 chatId, senderId, message 정보를 서버로 전송합니다.
export const sendMessage = (socket, { chatId, senderId, message, location }) => {
    socket.emit('sendMessage', { chatId, senderId, message, location });
};

export const readMessages = (socket, { chatId, userId }) => {
    socket.emit('readMessages', { chatId, userId });
};

export const setAppointment = (socket, { chatId, appointmentDate, appointmentCheck }) => {
  socket.emit('setAppointment', { chatId, appointmentDate, appointmentCheck });
};

export const appointmentCheck = (socket, {chatId, appointmentCheck}) => {
  socket.emit('appointmentCheck',{chatId, appointmentCheck});
};

export const ExitRoom = (socket, { chatId, userId }) => {
  console.log("exitroom 테스트");
  socket.emit('ExitRoom', { chatId, userId });
};

export const TradeComplete = (socket, { chatId, productId }) => {
  // console.log("TradeComplete 테스트");
  socket.emit('TradeComplete', { chatId, productId });
};

//   export const getMessage = (socket, callback) => {
//     socket.on('newMessage', (newmessage) => {
//         callback(newmessage);
//     });
//   };

export const deleteAppointment = (socket, {chatId}) => {
  socket.emit('deleteAppointment',{chatId});
};

export const ReportMessage = (socket, { reportedUserId, reason }) => {
  socket.emit('ReportMessage', { reportedUserId, reason });
};
//getUserConversations: 사용자의 대화 목록을 가져오는 함수입니다. socket.emit을 사용하여 getUserConversations 이벤트와 userId 정보를 서버로 전송합니다. 그리고 userConversations 이벤트를 수신하여 대화 목록을 해결된 프로미스로 반환합니다.  
export const getUserConversations = (socket, userId) => {
  return new Promise((resolve, reject) => {
    socket.emit('getUserConversations', { userId });

    socket.on('userConversations', (userChats) => {
      resolve(userChats);
    });

  });
};

//disconnect: 소켓 연결을 종료하는 함수입니다. socket.disconnect를 호출하여 소켓 연결을 닫고, 필요한 경우 콜백 함수를 호출합니다.
export const disconnect = (socket, myId, callback) => {
    // socket.emit("LEAVE_ROOM", { userId: myId });
    socket.disconnect();
    if (callback) callback();
};