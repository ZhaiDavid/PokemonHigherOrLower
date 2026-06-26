"use client";
import { useEffect, useState } from "react";
import PokemonCard from "../../components/PokemonCard";
import { socket } from "../../../lib/socketClient"

import "./GameComponent.css"


export default function GameComponent({ startingPokemons, roomName, pokemonData }) {
  const [pokemons, setPokemons] = useState(startingPokemons);
  const [score, setScore] = useState(0);
  useEffect(() => {
    const handleRoomUpdate = ({ pokemons }) => {
      setPokemons(pokemons);
    }
    socket.on("room-update", handleRoomUpdate);

    const handleScoreUpdate = ({ score }) => {
      console.log(score);
      setScore(score);
    }

    socket.on("score-update", handleScoreUpdate);

    return () => {
      socket.off("room-update", handleRoomUpdate);
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
      player: socket.id,
      roomName: roomName,
      answeredCorrectly: answerCorrectly(pokemon)
    })

  }

  return (
    <>
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
                locked={false}
                usage={pokemonData[randomPokemon]["usage"]["weighted"]}
                handleImageClick={handleImageClick} />
            ))}
          </div>
        </div>
    </>
  )
}