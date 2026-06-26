"use client"
import { io } from 'socket.io-client';

function getUserId() {
  let userId = localStorage.getItem("userId");

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("userId", userId);
  }

  return userId;
}

console.log(getUserId());

export const socket = io("http://localhost:3000", {
  auth: {
    userId: getUserId()
  }
});