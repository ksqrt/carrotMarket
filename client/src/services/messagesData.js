const io = require('socket.io-client');
const socket = io('http://localhost:5000');


function startChat({ buyerId, sellerId }) {
    socket.emit('startChat', { buyerId, sellerId });
}

function sendMessage({ chatId, senderId, message }) {
    socket.emit('sendMessage', { chatId, senderId, message });
}

function getMessage(callback) {
    socket.on('newMessage', ({ senderId, message }) => {
        callback({ senderId, message });
    });
}

function disconnect(callback) {
    socket.on('disconnect', () => {
        callback();
    });
}

function getUserConversations(userId, callback) {
    socket.emit('getUserConversations', userId);
    socket.on('userConversations', (conversations) => {
        callback(conversations);
    });
}

module.exports = {
    startChat,
    sendMessage,
    getMessage,
    disconnect,
    getUserConversations,
    socket
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