"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { socket } from "../../socket/socketClient";

import { modesList } from "../../constants/modes";
import MatchmakeLoader from "./_components/MatchmakeLoader";

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

  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const format = data.get('mode')

    if (!searchClicked) {
      socket.emit("match-search", format, {});
      setInQueue(true);
    }
  }

  return (
    <div className="box">
      <div className="content-container">
        <div className="form-container p-10 rounded-md">
          {!inQueue && <form onSubmit={submit}>
            <input type="text"
              placeholder="type your username..."
              className="text-center"
              onChange={(event) => {
                setUserName(event.target.value);
              }} />
            <div className="mt-3 flex flex-col items-center">
              <label className="" htmlFor="modes">Choose a Mode</label>
              <select className="mt-2" id="modes" name="mode">
                {modesList.map((element, index) => (
                  <option key={element} value={element}>{element}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="mt-3 p-3 rounded-sm bg-blue-300 hover:bg-[#56579A] hover:text-white">
            Find Match
          </button>
          </form>}
          {inQueue && <MatchmakeLoader/>}
        </div>
      </div>
    </div>
  )
}