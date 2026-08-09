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

  // TODO: Have to change some logic to figure out how we work out modes for this?
  return (
    <>
      <div className="box">
        <div className="content-container">
          <div className="form-container p-10 rounded-md">
            {!createdRoom ? (
              <>
                <form className="flex flex-col items-center">
                  <input type="text"
                    placeholder="type your name..."
                    className="text-center"
                    onChange={(event) => {
                      if (matcher.hasMatch(event.target.value)) {
                        setUserName("Anonymous");
                      }
                      else {
                        setUserName(event.target.value);
                      }
                    }} />
                  <div className="mt-3 flex flex-col items-center">
                    <label className="" htmlFor="formats">Choose a Format</label>
                    <select className="mt-2" id="formats" name="format"
                      onChange={(event) => {
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
              </>) :
              (<button className="p-2 rounded-lg bg-blue-300 hover:bg-[#56579A] hover:text-white" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/multiplayer/join-room?roomName=${roomName}&format=${format}`)}>
                Copy Party Link
              </button>)}
          </div>
        </div>
      </div>
    </>
  )
}