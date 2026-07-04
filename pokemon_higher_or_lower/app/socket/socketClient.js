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

export const socket = io("http://localhost:3000", {
  auth: {
    userId: getUserId()
  }
});