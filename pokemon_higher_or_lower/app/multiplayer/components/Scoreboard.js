"use client"
import { useState, useEffect } from "react";
import { socket } from "../../socket/socketClient";

import "./Scoreboard.css";

export default function Scoreboard({ userNames, roomScores }) {
    const usernames = new Map(userNames);
    const [scores, setScores] = useState(new Map(roomScores));

    useEffect(() => {
        const handleScoreUpdate = ({ score, roomScore }) => {
            console.log(roomScore);
            setScores(new Map(Object.entries(roomScore)));
            console.log(scores);
        }
        
        socket.on("score-update", handleScoreUpdate);

        return () => {
            socket.off("score-update", handleScoreUpdate);
        }
    }, [])

    return (
        <div className="scoreboard-container p-2 rounded-md">
            <h1 className="board-header">Score</h1>
            <div className="board-scores">
            {Array.from(usernames.keys()).map((id, index) => (
                <div className="score-content-container" key={index}>
                    <p className="content-username">{usernames.get(id)}</p>
                    <p className="content-score"> : {scores.get(id)}</p>
                </div>
            ))}
            </div>
        </div>
    )
}