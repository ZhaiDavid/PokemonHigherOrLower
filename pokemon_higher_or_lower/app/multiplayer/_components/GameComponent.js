"use client";
import { useEffect, useState } from "react";
import PokemonCard from "../../_components/PokemonCard";
import SubmitNotification from "../../_components/SubmitNotification";
import Scoreboard from "./Scoreboard";
import QuestionIndicator from "./QuestionIndicator";
import { socket } from "../../socket/socketClient"

import "./GameComponent.css"
import ResultComponent from "./ResultComponent";


export default function GameComponent({ startingPokemons, roomName, pokemonData, playerScore, roomScore, playerUsernames, format, userID }) {
  const [pokemons, setPokemons] = useState(startingPokemons);
  // const [score, setScore] = useState(playerScore);
  // when it's locked, we will also show a pop-up notif for when 
  // someone submitted the answer
  const [locked, setLocked] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [lastUserSubmitted, setLastUserSubmitted] = useState(null);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [seconds, setSeconds] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [draw, setDraw] = useState(false);

  // Variables for score tracking
  const [usernames, setUsernames] = useState(new Map(playerUsernames));
  const [scores, setScores] = useState(new Map(roomScore));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(prev => locked ? prev : prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [locked]);

  useEffect(() => {
    // room is updated when one user submits an answer
    const handleRoomUpdate = ({ pokemons, questionNumber }) => {
      setLocked(true);
      setSeconds(5);
      setQuestionNumber(questionNumber);

      setTimeout(() => {
        setLocked(false);
        setPokemons(pokemons);
      }, 1000
      );
    }

    socket.on("room-update", handleRoomUpdate);

    // const handleScoreUpdate = ({ score}) => {
    //   setScore(score);
    // }

    // socket.on("score-update", handleScoreUpdate);

    const handleUserSubmitted = ({ user, answeredCorrectly }) => {
      setLastUserSubmitted(user);
      setLastCorrect(answeredCorrectly);
      setShowNotif(true);
      setTimeout(() => {
        setShowNotif(false);
      }, 1000);
    }

    const handle_gameover = () => {
      setGameOver(true);
      setLocked(true);
    }

    const handle_win = () => {
      setHasWon(true);
    }

    const handle_draw = () => {
      setDraw(true);
    }

    const handleScoreUpdate = ({ playerUsernames, roomScore }) => {
      setUsernames(new Map(Object.entries(playerUsernames)));
      setScores(new Map(Object.entries(roomScore)));
      console.log("SCORES");
      console.log(scores);
    }

    socket.on("user-submitted", handleUserSubmitted);
    socket.on("game-over", handle_gameover);
    socket.on("win", handle_win);
    socket.on("draw", handle_draw);
    socket.on("score-update", handleScoreUpdate);


    return () => {
      socket.off("room-update", handleRoomUpdate);
      // socket.off("score-update", handleScoreUpdate);
      socket.off("user-submitted", handleUserSubmitted);
      socket.off("game-over", handle_gameover);
      socket.off("win", handle_win);
      socket.off("draw", handle_draw);
      socket.off("score-update", handleScoreUpdate);
    }
  }, [])

  function handleImageClick(pokemon) {
    const answerCorrectly = (pokemon) => {
      const usage = pokemonData[pokemon]["usage"]["weighted"];
      for (const name of pokemons) {
        if (name === pokemon) continue;
        if (pokemonData[name]["usage"]["weighted"] > usage) {
          return false;
        }
      }
      return true;
    }

    socket.emit("submit-answer", {
      roomName: roomName,
      answeredCorrectly: answerCorrectly(pokemon)
    })

  }

  return (
    <>
      <div className="game-component">
        {showNotif && <SubmitNotification user={lastUserSubmitted}
          correct={lastCorrect} />}
        <div className="timer">
          {seconds}
        </div>
        <div className="score-container px-4 py-2 text-lg font bold">
          {/* <p className="p-2 bg-black">Score: {score}</p> */}

          <Scoreboard userNames={usernames} roomScores={scores} userID={userID}/>
        </div>
        <div className="question-indicator px-4 py-2">
          <QuestionIndicator questionNumber={questionNumber} />
        </div>
        <div className="cards-container grid grid-cols-1 sm:grid-cols-2">
          {pokemons !== null && pokemons.map((randomPokemon, index) => (
            <PokemonCard
              key={index}
              randomPokemon={randomPokemon}
              index={index}
              locked={locked}
              usage={pokemonData[randomPokemon]["usage"]["weighted"]}
              format = {format}
              handleImageClick={handleImageClick} />
          ))}
        </div>
        {gameOver && <ResultComponent hasWon={hasWon} draw = {draw} roomScore={scores} playerUsernames={usernames} userID={userID}  />}

      </div>
    </>
  )
}