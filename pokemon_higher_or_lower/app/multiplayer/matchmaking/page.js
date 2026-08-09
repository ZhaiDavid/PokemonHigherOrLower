"use client";
import { useState, useEffect, useRef } from "react";

import { useRouter } from 'next/navigation';
import { socket } from "../../socket/socketClient";
import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers } from 'obscenity';

import { formatsList } from "../../constants/formats.js";
import MatchmakeLoader from "./_components/MatchmakeLoader";

import "./page.css"

export default function Page() {
  const [userName, setUserName] = useState("");
  const [format, setFormat] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const router = useRouter();

  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  useEffect(() => {
    socket.emit("in-matchmaking", {});
    const handleInQueue = ({ inQueue }) => {
      setInQueue(inQueue)
    }

    socket.on("in-queue", handleInQueue);
    return () => {
      socket.off("in-queue", handleInQueue);
    }
  }, [])


  useEffect(() => {
    function handle_match_found(roomName) {
      const query = new URLSearchParams({ roomName, userName, format }).toString();
      router.push(`/multiplayer?${query}`);
    };

    socket.on("match-found", async ({ roomName }) => {
      handle_match_found(roomName);
      socket.off("match-search", {});
    });

    return () => {
      socket.off("match-found", async ({ roomName }) => {
        handle_match_found(roomName);
        socket.off("match-search", {});
      });
    };
  }, [router, userName, format]);

  useEffect(() => {
    socket.emit("in-match-check");

    // Forcing rerouting if already in game
    function handleAlreadyInMatch({ query }) {
      router.push(`/multiplayer?${query}`);
    }

    socket.on("already-in-match", handleAlreadyInMatch);

    return () => {
      socket.off("already-in-match", handleAlreadyInMatch);
    }
  }, [])

  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    setFormat(data.get('format'));

    if (!searchClicked) {
      console.log(format);
      socket.emit("match-search", data.get('format'), {});
      setInQueue(true);
    }
  }

  return (
    <div className="box">
      <div className="content-container">
        <div className="form-container p-10 rounded-md">
          {!inQueue && <form onSubmit={submit} className="flex flex-col justify-center items-center">
            <input type="text"
              placeholder="type your username..."
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
              <select className="mt-2" id="formats" name="format">
                {formatsList.map((element, index) => (
                  <option key={element} value={element}>{element}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="mt-3 p-3 rounded-sm bg-blue-300 hover:bg-[#56579A] hover:text-white">
              Find Match
            </button>
          </form>}
          {inQueue && <MatchmakeLoader />}
          {inQueue && format}
        </div>
      </div>
    </div>
  )
}