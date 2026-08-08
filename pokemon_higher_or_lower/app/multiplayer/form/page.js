"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { formatsList } from "../../constants/formats.js";
import { socket } from "../../socket/socketClient";

import "./page.css"

export default function Page() {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState(crypto.randomUUID());
  const [format, setFormat] = useState("gen1ou");
  const [createdRoom, setCreatedRoom] = useState(false);
  const router = useRouter();


  useEffect(() => {
      const handle_match_ready = () => {
        router.push(`/multiplayer?roomName=${roomName}&userName=${userName}&format=${format}`);
      }
      socket.on('ready-to-start-match', handle_match_ready);

      return () => {
        socket.off("ready-to-start-match", handle_match_ready);
      };
    }, [roomName, userName, format, router])

  function submit() {
    setCreatedRoom(true);
    socket.emit("joined-room", {
      roomName: roomName,
      userName: userName,
      numPokemon: 2,
      format: format
    });
  }

  function copyText() {
    navigator.clipboard.writeText("some text to copy");
  }

  // TODO: Have to change some logic to figure out how we work out modes for this?
  return (
    <>
      <div className="box">
        <div className="content-container">
          {!createdRoom?(
            <div className="form-container p-10 rounded-md">
              <form className="flex flex-col items-center">
                <input type="text"
                  placeholder="type your name..."
                  className="text-center"
                  onChange={(event) => {
                    setUserName(event.target.value);
                  }} />
                <div className="mt-3 flex flex-col items-center">
                <label className="" htmlFor="formats">Choose a Format</label>
                <select className="mt-2" id="formats" name="format"
                        onChange={(event)=> {
                          setFormat(event.target.value);
                        }}>
                  {formatsList.map((element, index) => (
                    <option key={index} value={element}>{element}</option>
                  ))}
                </select>
              </div>
              </form>
              <button className="mt-3 p-3 rounded-sm bg-blue-300 hover:bg-[#56579A] hover:text-white" onClick={submit}>
                Submit
              </button>
            </div>): 
            (<button onClick={() => navigator.clipboard.writeText(`localhost:3000/multiplayer?roomName=${roomName}&userName=${userName}&format=${format}`)}>
              Copy Party Link
            </button>)}
        </div>
      </div>
    </>
  )
}