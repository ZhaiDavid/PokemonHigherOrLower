"use client"
import { io } from 'socket.io-client';

export function getUserId() {
  if (typeof window !== 'undefined') {
    let userId = localStorage.getItem("userId");

    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("userId", userId);
    }

    return userId;
  }
}

let socket;
if (typeof window !== 'undefined') {
  const socketUrl = window.location.origin;
  socket = io(socketUrl, {
    auth: {
      userId: getUserId(),
    },
  });
}

export { socket };