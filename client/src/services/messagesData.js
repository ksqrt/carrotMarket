const io = require('socket.io-client');
let socket;


export function initializeSocket() {
    socket = io('http://localhost:5000', {
    });
    console.log('Socket created:', socket);

    socket.on('connect_error', (error) => {
        console.log('Connection Error', error);
    });
}

export function startChat({ buyerId, sellerId}) {
    socket.emit('startChat', { buyerId, sellerId });
}

export function sendMessage({ chatId, senderId, message }) {
  return new Promise((resolve, reject) => {
    socket.emit('sendMessage', { chatId, senderId, message }, (error) => {
      if (error) return reject(error);
      resolve();
    });
  });
}

export function getMessage(callback) {
    console.log('getmessage test');
    socket.on('newMessage', ({ senderId, message }) => {
        console.log('Received a new message 😎  ', { senderId, message }); // 로그 찍기
        callback({ senderId, message });
    });
}

export function disconnect(callback) {
    console.log("연결 종료");
    socket.on('disconnect', () => {
        callback();
    });
}

export function getUserConversations(userId) {
    return new Promise((resolve, reject) => {
        socket.emit('getUserConversations', {userId});
        socket.on('userConversations', (conversations) => {
            resolve(conversations);
        });
        socket.on('error', reject);
    });
}

export { socket };

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