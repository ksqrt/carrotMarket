import { io as IO } from "socket.io-client";

//initializeSocket: 소켓을 초기화하고 서버에 연결하는 함수입니다. IO 함수를 사용하여 http://localhost:5000에 소켓을 생성하고 반환합니다.
export const initializeSocket = async () => {
  const socket = IO("http://localhost:5000");
  // const socket = IO("http://101.79.11.48:5000");

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    console.log(socket.connected);
    });
  console.log("Socket created:", socket);
  return socket;

};

//startChat: 채팅을 시작하는 함수입니다. socket.emit을 사용하여 startChat 이벤트와 buyerId, sellerId 정보를 서버로 전송합니다.
export const startChat = (socket, { buyerId, sellerId}) => {
    console.log('StartChat function execution');
    socket.emit('startChat', { buyerId, sellerId });
};

//sendMessage: 메시지를 전송하는 함수입니다. socket.emit을 사용하여 sendMessage 이벤트와 chatId, senderId, message 정보를 서버로 전송합니다.
export const sendMessage = (socket, { chatId, senderId, message }) => {
    socket.emit('sendMessage', { chatId, senderId, message });
};

//getMessage: 새로운 메시지를 받는 함수입니다. socket.on을 사용하여 서버로부터 newMessage 이벤트를 수신하면 콜백 함수를 호출하여 메시지를 처리합니다. 이 함수는 서버로부터 전달된 메시지를 인자로 콜백 함수를 실행합니다.
export const getMessage = (socket, callback) => {
  socket.on('newMessage', (message) => {
      callback(message);
  });
};

//   export const getMessage = (socket, callback) => {
//     socket.on('newMessage', (newmessage) => {
//         callback(newmessage);
//     });
//   };

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
export const disconnect = (socket, callback) => {
    socket.disconnect();
    if (callback) callback();
};

/*
const baseUrl = 'http://localhost:5000';

// receiver, message를 인자로 받는 채팅방 생성
export async function createChatRoom(receiver, message) {
    return (await fetch(`${baseUrl}/messages/createChatRoom`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        // 로그인 인증 data도 같이 보냄
        credentials: 'include',
        body: JSON.stringify({message: message, receiver: receiver})
    })).json();
}

export async function getUserConversations() {
    return (await fetch(`${baseUrl}/messages/getUserConversations`, { credentials: 'include' })).json();
}

export async function sendMessage(chatId, message) {
    return (await fetch(`${baseUrl}/messages/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({chatId, message})
    })).json();
}
*/