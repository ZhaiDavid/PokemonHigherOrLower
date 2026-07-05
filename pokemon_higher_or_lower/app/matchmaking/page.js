"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { socket } from "../socket/socketClient";

import SiteHeader from "../components/SiteHeader";
import MatchmakeLoader from "./components/MatchmakeLoader";


import "./page.css"

export default function Page() {
  const[userName, setUserName] = useState("");
  const[searchClicked, setSearchClicked] = useState(false);
  const[inQueue, setInQueue] = useState(false);
  const router = useRouter();

  useEffect(() => {
     socket.emit("in-matchmaking", {});
     const handleInQueue = ({inQueue}) => {
        setInQueue(inQueue)
      }

      socket.on("in-queue", handleInQueue);
      return () => {
        socket.off("in-queue", handleInQueue);
      }
  }, [])


  useEffect(() => {
      function handle_match_found(roomName) {
        const query = new URLSearchParams({ roomName, userName }).toString();
        router.push(`/multiplayer?${query}`);
      };
      
      socket.on("match-found", async ({roomName}) => {
        handle_match_found(roomName);
        socket.off("match-search", {});
      });


  
      return () => {
        socket.off("match-found", async ({roomName}) => {
          handle_match_found(roomName);
          socket.off("match-search", {});
        });
      };
  }, [router, userName]);

  function submit() {
    if (!searchClicked) {
      socket.emit("match-search", {});
      setInQueue(true);
    }
  }

  return (
    <div className="box">
      <SiteHeader />
      <div className="content-container">
        <div className="form-container p-10 rounded-md">
          {!inQueue && <form>
            <input type="text"
              placeholder="type your username..."
              className="text-center"
              onChange={(event) => {
                setUserName(event.target.value);
              }} />
          </form>}
          {!inQueue && <button onClick={submit} className="mt-2 p-3 rounded-sm bg-blue-300 hover:bg-[#56579A] hover:text-white">
            Find Match
          </button>}
          {inQueue && <MatchmakeLoader/>}
        </div>
      </div>
    </div>
  )
}