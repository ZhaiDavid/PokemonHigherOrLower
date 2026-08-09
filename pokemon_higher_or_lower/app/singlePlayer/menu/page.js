"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

import { formatsList } from "../../constants/formats";

import "./page.css"

export default function Page() {
  const router = useRouter()

  function submit(formData) {
    const format = formData.get('format');
    router.push(`/singleplayer?format=${format}`);
  }

  return (
    <div className="box">
      <div className="content-container">
        <div className="form-container p-10 rounded-md">
          <form action={submit} className="flex flex-col items-center">
            <label className="" htmlFor="formats">Choose a Mode</label>
            <select className="mt-2" id="formats" name="format">
              {formatsList.map((element, index) => (
                <option key={element} value={element}>{element}</option>
              ))}
            </select>
            <button type="submit" className="mt-3 p-3 rounded-sm bg-blue-300 hover:bg-[#56579A] hover:text-white">
              Play
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}