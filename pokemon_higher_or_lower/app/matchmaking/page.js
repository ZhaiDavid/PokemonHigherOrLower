"use client";
import { useState, useEffect, useRef} from "react";
import { useRouter } from 'next/navigation';
import { socket } from "../socket/socketClient";

export default function Page() {
  const[userName, setUserName] = useState("");
  const[searchClicked, setSearchClicked] = useState(false)
  const router = useRouter();
  const socketRef = useRef(null);

  useEffect(() => {
      socketRef.current = socket;

      function handle_match_found(roomName) {
        const query = new URLSearchParams({ roomName, userName }).toString();
        router.push(`/multiplayer?${query}`);
      };
      
      socketRef.current.on("match-found", async ({roomName}) => {
        handle_match_found(roomName);
        socketRef.current.off("match-search", {});
      });
  
      return () => {
        socketRef.current.off("match-found", async ({roomName}) => {
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
    <>
      <form>
        <input type = "text" 
               placeholder = "type your username..."
               onChange = {(event) => {
                            setUserName(event.target.value);
                          }}/>
      </form>
      <button onClick = {submit}>
        Find Match
      </button>
      {searchClicked && <p>In Queue</p>}
    </>
  )
}