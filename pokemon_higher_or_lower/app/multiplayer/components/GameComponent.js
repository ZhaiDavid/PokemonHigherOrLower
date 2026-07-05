"use client";
import { useEffect, useState } from "react";
import PokemonCard from "../../components/PokemonCard";
import SubmitNotification from "../../components/SubmitNotification";
import { socket } from "../../socket/socketClient"

import "./GameComponent.css"


export default function GameComponent({ startingPokemons, roomName, pokemonData, playerScore }) {
  const [pokemons, setPokemons] = useState(startingPokemons);
  const [score, setScore] = useState(playerScore);
  // when it's locked, we will also show a pop-up notif for when 
  // someone submitted the answer
  const [locked, setLocked] = useState(false); 
  const [showNotif, setShowNotif] = useState(false);
  const [lastUserSubmitted, setLastUserSubmitted] = useState(null);
  const [lastCorrect, setLastCorrect] = useState(null);
  useEffect(() => {

    // room is updated when one user submits an answer
    const handleRoomUpdate = ({ pokemons, user }) => { 
      setLocked(true);

      setTimeout(() => {
          setLocked(false);
          setPokemons(pokemons);
        }, 1000
      );
    }

    socket.on("room-update", handleRoomUpdate);

    const handleScoreUpdate = ({ score }) => {
      console.log(score);
      setScore(score);
    }

    socket.on("score-update", handleScoreUpdate);

    const handleUserSubmitted = ({user, answeredCorrectly}) => {
      setLastUserSubmitted(user);
      setLastCorrect(answeredCorrectly);
      setShowNotif(true);
      setTimeout(() => {
        setShowNotif(false);
      }, 1000);
    }

    socket.on("user-submitted", handleUserSubmitted);

    return () => {
      socket.off("room-update", handleRoomUpdate);
      socket.off("score-update", handleScoreUpdate);
      socket.off("user-submitted", handleUserSubmitted);
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
        {showNotif && <SubmitNotification user = {lastUserSubmitted}
                                       correct = {lastCorrect}/>}
        <div className="game-component">
          <div className="score-container px-4 py-2 text-lg font bold">
            <p className="p-2 bg-black">Score: {score}</p>
          </div>
          <div className="cards-container grid grid-cols-1 sm:grid-cols-2">
            {pokemons !== null && pokemons.map((randomPokemon, index) => (
              <PokemonCard
                key={index}
                randomPokemon={randomPokemon}
                index={index}
                locked={locked}
                usage={pokemonData[randomPokemon]["usage"]["weighted"]}
                handleImageClick={handleImageClick} />
            ))}
          </div>
        </div>
    </>
  )
}