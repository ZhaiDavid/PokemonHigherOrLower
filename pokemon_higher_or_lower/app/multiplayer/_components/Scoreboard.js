"use client"
import { useState, useEffect } from "react";
import { socket } from "../../socket/socketClient";

import "./Scoreboard.css";

export default function Scoreboard({ userNames, roomScores, userID }) {
    return (
        <div className="scoreboard-container p-2 rounded-md">
            <h1 className="board-header">Score</h1>
            <div className="board-scores">
            {Array.from(userNames.keys()).map((id, index) => (
                <div className="score-content-container" key={index}>
                    <p className="content-username">{userNames.get(id)}</p>
                    <p className="content-score"> : {roomScores.get(id)}</p>
                    {(id == userID) && <p>(You)</p>}
                </div>
            ))}
            </div>
        </div>
    )
}