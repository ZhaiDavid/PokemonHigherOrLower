"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { formatsList } from "../../constants/formats.js";

import "./page.css"

export default function Page() {
  const [userName, setUserName] = useState("");
  const [format, setFormat] = useState("gen1ou");
  const router = useRouter();

  function submit() {
    const query = new URLSearchParams({ roomName, userName}).toString();
    router.push(`/multiplayer?${query}&format=${format}`);
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
            <button className="mt-2" onClick={submit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  )
}