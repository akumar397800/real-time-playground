// services/socket.js
import io from 'socket.io-client';

let socket;

export const initSocket = () => {
  socket = io('http://localhost:5000');
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  return socket;
};