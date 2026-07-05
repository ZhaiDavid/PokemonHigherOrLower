"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { socket } from "../socket/socketClient";

import SiteHeader from "../components/SiteHeader";

import "./page.css"

export default function Page() {
  const [userName, setUserName] = useState("");
  const [searchClicked, setSearchClicked] = useState(false)
  const router = useRouter();
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = socket;

    function handle_match_found(roomName) {
      const query = new URLSearchParams({ roomName, userName }).toString();
      router.push(`/multiplayer?${query}`);
    };

    socketRef.current.on("match-found", async ({ roomName }) => {
      handle_match_found(roomName);
      socketRef.current.off("match-search", {});
    });

    return () => {
      socketRef.current.off("match-found", async ({ roomName }) => {
        handle_match_found(roomName);
        socketRef.current.off("match-search", {});
      });
    };
  }, [router, userName]);

  function submit() {
    if (socketRef.current && !searchClicked) {
      socketRef.current.emit("match-search", {});
      setSearchClicked(true);
    }
  }

  return (
    <div className="box">
      <SiteHeader />
      <div className="content-container">
        <div className="form-container p-10 rounded-md">
          <form>
            <input type="text"
              placeholder="type your username..."
              className="text-center"
              onChange={(event) => {
                setUserName(event.target.value);
              }} />
          </form>
          <button onClick={submit} className="mt-2 p-3 rounded-sm bg-blue-300 hover:bg-[#56579A] hover:text-white">
            Find Match
          </button>
          {searchClicked && <p>In Queue</p>}
        </div>
      </div>
    </div>
  )
}