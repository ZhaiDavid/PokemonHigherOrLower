"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { redirect } from "next/navigation";

import { modesList } from "../../constants/modes";

import "./page.css"

export default function Page() {
  const router = useRouter()

  function submit(formData) {
    const mode = formData.get('modes');
    redirect(`/singlePlayer/${mode}`);
  }

  return (
    <div className="box">
      <div className="content-container">
        <div className="form-container p-10 rounded-md">
          <form action={submit} className="flex flex-col items-center">
            <label className="" htmlFor="modes">Choose a Mode</label>
            <select className="mt-2" id="modes" name="modes">
              {modesList.map((element, index) => (
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