// socket.js (Ensure proper connection logging)
import socket from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (projectId) => {
    if (!socketInstance) {
        socketInstance = socket(import.meta.env.VITE_API_URL, {
            auth: { token: localStorage.getItem('token') },
            query: { projectId }
        });

        socketInstance.on("connect", () => {
            console.log("Socket connected successfully");
        });
    }
    return socketInstance;
};

export const receiveMessage = (eventName, callback) => {
    if (!socketInstance) {
        console.error('Socket not initialized');
        return;
    }
    console.log(`Listening for event: ${eventName}`);
    socketInstance.on(eventName, callback);
};

export const sendMessage = (eventName, data) => {
    if (!socketInstance) {
        console.error('Socket not initialized');
        return;
    }
    console.log("Sending message:", data);
    socketInstance.emit(eventName, data);
};