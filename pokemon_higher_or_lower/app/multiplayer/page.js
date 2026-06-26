"use client"
import GameComponent from './components/GameComponent';
import SiteHeader from '../components/SiteHeader';

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { socket } from "../../lib/socketClient";

export default function Page () {
  const params = useSearchParams();
  const [pokemons, setPokemons] = useState(null);
  const [pokemonKeys, setPokemonKeys] = useState(null);
  const [players, setPlayers] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);
  const roomName = params.get("roomName");
  const userName = params.get("userName");

  // for some reason useEffect runs twice
  useEffect(() => {
    socket.emit("joined-room", {
      roomName: roomName,
      userName: userName,
      numPokemon: 2
    });

    const handle_room_state = ({pokemons, pokemonData, pokemonKeys, players}) => {
      setPokemons(pokemons);
      setPokemonData(pokemonData);
      setPokemonKeys(pokemonKeys);
      setPlayers(players);
    };

    socket.on("room-state", handle_room_state);


    return () => {
        socket.off("room-state", handle_room_state);
    };
  }, []);


  return (
    <>
      <SiteHeader />
      {pokemons && <GameComponent
        startingPokemons = {pokemons}
        pokemonData = {pokemonData}
        roomName = {roomName}
      />}
    </>
  )
}