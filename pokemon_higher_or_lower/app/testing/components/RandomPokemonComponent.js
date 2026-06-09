"use client";
import { useEffect, useState} from "react";


export default function RandomPokemonComponent ({pokemonKeys, pokemon}) {
    const [randomPokemon, setRandomPokemon] = useState("Amoonguss");

    function handleClick() {
        const randomIndex = Math.floor(Math.random() * pokemonKeys.length);
        setRandomPokemon(pokemonKeys[randomIndex])
    }
    
    return (
        <>
            <button onClick={handleClick}> Click Me </button>
            <p>{randomPokemon}</p>
            <p>Usage: {(pokemon[randomPokemon]["usage"]["weighted"]*100).toFixed(2)} %</p>
            <img width="100px" src={`https://www.smogon.com/dex/media/sprites/xy/${randomPokemon.split(' ').join('-').toLowerCase()}.gif`} />
        </>
    )
}