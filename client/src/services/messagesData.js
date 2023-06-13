import { io as IO } from "socket.io-client";

export const initializeSocket = async () => {
  const socket = IO("http://localhost:5000");
  console.log("Socket created:", socket);
  return socket;
};

export const startChat = (socket, { buyerId, sellerId}) => {
    console.log('StartChat function execution');
    socket.emit('startChat', { buyerId, sellerId });
};

export const sendMessage = (socket, { chatId, senderId, message }) => {
    socket.emit('sendMessage', { chatId, senderId, message });
};


  export const getMessage = (socket, callback) => {
    socket.on('newMessage', (message) => {
        callback(message);
    });
  };

  
  export const getUserConversations = (socket, userId) => {
    return new Promise((resolve, reject) => {
      socket.emit('getUserConversations', { userId });
  
      socket.on('userConversations', (userChats) => {
        resolve(userChats);
      });
  
    });
  };


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