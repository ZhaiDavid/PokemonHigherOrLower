"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

import "./page.css"

export default function Page() {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  function submit() {
    const query = new URLSearchParams({ roomName, userName }).toString();
    router.push(`/multiplayer?${query}`);
  }

  // TODO: Have to change some logic to figure out how we work out modes for this?
  return (
    <>
      <div className="box">
        <div className="content-container">
          <div className="form-container p-10 rounded-md">
            <form className="flex flex-col items-center">
              <input type="text"
                placeholder="type your name..."
                className="text-center"
                onChange={(event) => {
                  setUserName(event.target.value);
                }} />
              <input type="text"
                placeholder="enter room name..."
                className="mt-2 text-center"
                onChange={(event) => {
                  setRoomName(event.target.value);
                }} />
            </form>
            <button className="mt-2" onClick={submit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  )
}