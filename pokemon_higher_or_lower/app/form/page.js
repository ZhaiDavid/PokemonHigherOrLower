"use client";
import { useState} from "react";
import { useRouter } from 'next/navigation';

export default function Page() {
  const[userName, setUserName] = useState("");
  const[roomName, setRoomName] = useState("");
  const router = useRouter();

  function submit() {
    const query = new URLSearchParams({ roomName, userName }).toString();
    router.push(`/multiplayer?${query}`);
  }
  return (
    <>
      <form>
        <input type = "text" 
               placeholder = "type your name..."
               onChange = {(event) => {
                          setUserName(event.target.value);
                          }}/>
        <input type = "text" 
               placeholder = "enter room name..."
               onChange = {(event) => {
                          setRoomName(event.target.value);
                          }}/>
      </form>
      <button onClick = {submit}>
        submit
      </button>
    </>
  )
}