"use client";
import { useEffect, useState} from "react";
import PokemonCard from "../../components/PokemonCard";
import {socket} from "../../../lib/socketClient"


export default function GameComponent ({startingPokemons, roomName, pokemonData}) {
  const [pokemons, setPokemons] = useState(startingPokemons);
  const [score, setScore] = useState(0);
  useEffect(() => {
    const handleRoomUpdate = ({pokemons}) => {
      setPokemons(pokemons);
    }
    socket.on("room-update", handleRoomUpdate);

    const handleScoreUpdate = ({score}) => {
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
       {score}
       {pokemons != null && pokemonData != null && pokemons.map((pokemon, index) => (
                    <PokemonCard 
                        key={index} 
                        randomPokemon={pokemon} 
                        index={index} 
                        locked={false}
                        usage = {pokemonData[pokemon]["usage"]["weighted"]}
                        handleImageClick = {handleImageClick} />
                  ))}
  
    </>
  )
}