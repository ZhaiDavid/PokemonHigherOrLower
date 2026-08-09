"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { socket } from "../../socket/socketClient";
import { useSearchParams } from "next/navigation";


import "./page.css"

export default function Page() {
  const params = useSearchParams();
  const roomName = params.get("roomName");
  const format = params.get("format");
  const router = useRouter();

  const [userName, setUserName] = useState("");

  function submit(event) {
    event.preventDefault();
    router.push(`/multiplayer?roomName=${roomName}&userName=${userName}&format=${format}`)
    
  }

  return (
    <div className="box">
      <div className="content-container">
        <div className="form-container p-10 rounded-md">
          <form onSubmit={submit} className="flex flex-col justify-center items-center">
            <input type="text"
              placeholder="type your username..."
              className="text-center"
              onChange={(event) => {
                setUserName(event.target.value);
              }} />
            <button type="submit" className="mt-3 p-3 rounded-sm bg-blue-300 hover:bg-[#56579A] hover:text-white">
              Join Match
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}