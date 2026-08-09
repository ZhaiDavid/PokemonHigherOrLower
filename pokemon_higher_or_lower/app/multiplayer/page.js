"use client"
import GameComponent from './_components/GameComponent';
import ResultComponent from './_components/ResultComponent';

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { socket } from "../socket/socketClient";

export default function Page () {
  const params = useSearchParams();
  const [pokemons, setPokemons] = useState(null);
  const [playerScore, setPlayerScore] = useState(null);
  const [pokemonData, setPokemonData] = useState([]);
  const [roomScores, setRoomScores] = useState(null);
  const [playerUsernames, setPlayerUserNames] = useState(null)
  const [userID, setUserID] = useState(null);

  const roomName = params.get("roomName");
  const userName = params.get("userName");
  const format = params.get("format");

  const [gameFull, setGameFull] = useState(false);

  // for some reason useEffect runs twice
  useEffect(() => {
    socket.emit("joined-room", {
      roomName: roomName,
      userName: userName,
      numPokemon: 2,
      format: format
    });

    const handle_room_state = ({pokemons, pokemonData, playerScore, roomScores, playerUsernames}) => {
      setPokemons(pokemons);
      setPokemonData(pokemonData);
      setPlayerScore(playerScore);
      setRoomScores(roomScores);
      setPlayerUserNames(playerUsernames);
    };

    const handleUserID = ({userID}) => {
      setUserID(userID);
    }
    
    const handleGameFull = () => {
      setGameFull(true);
    }

    socket.on("game-full", handleGameFull);
    socket.on("room-state", handle_room_state);
    socket.on("user-id", handleUserID);

    return () => {
        socket.off("game-full", handleGameFull);
        socket.off("room-state", handle_room_state);
        socket.off("user-id", handleUserID);
    };
  }, []);


  return (
    <>
      {pokemons && !gameFull && <GameComponent
        startingPokemons = {pokemons}
        pokemonData = {pokemonData}
        roomName = {roomName}
        playerScore = {playerScore}
        roomScore = {roomScores}
        playerUsernames={playerUsernames}
        format={format}
        userID={userID}
      />}
      {gameFull && <div className='flex justify-center items-center flex-grow-1 text-4xl md:text-5xl font-bold'>Game Full</div>}
    </>
  )
}