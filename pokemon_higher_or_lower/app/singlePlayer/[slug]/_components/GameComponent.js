"use client";
import { useEffect, useState} from "react";
import PokemonCard from "../../../_components/PokemonCard";

import './GameComponent.css'


export default function GameComponent ({pokemonKeys, pokemon, size, format}) {
    useEffect(() => {
        setRandomPokemons(generateRandomPokemons());
    }, [pokemonKeys]);

    useEffect(() => {
        const localHighScore = localStorage.getItem("high-score");
        setHighScore(localHighScore === null ? 0 : localHighScore);

    }, [])
    
    const [randomPokemons, setRandomPokemons] = useState(null);
    const [locked, setLocked] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);


    function generateRandomPokemons() {
        const set = new Set();
        while (set.size < size) {
            set.add(Math.floor(Math.random() * pokemonKeys.length));
        }
        return [...set].map(num => pokemonKeys[num]);
    }

    function handleClick() {
        setRandomPokemons(generateRandomPokemons());
    }
    function handleImageClick(pokemonName) {
        const usage = pokemon[pokemonName]["usage"]["weighted"];
        for (const name of randomPokemons) {
            if (name === pokemonName) continue;
            if (pokemon[name]["usage"]["weighted"] > usage) {
                setLocked(true);
                setTimeout(() => {
                        setLocked(false);
                        setScore(0);
                        handleClick();
                    }, 1000);
                return;
            }
        }

        setLocked(true);
        setTimeout(() => {
                    setLocked(false);
                    setScore(score+1);
                    if (score+1 > highScore) {
                        setHighScore(score+1);
                        localStorage.setItem("high-score", score+1);
                    }
                    handleClick();
                    }, 1000);
    }
    
    return (
        <>  
            <div className="game-component">
                <div className="score-container px-4 py-2 text-lg font bold">
                    <p className="p-2 bg-black">High Score: {highScore}</p>
                    <p className="p-2 bg-black">Score: {score}</p>
                </div>
                <div className="cards-container grid grid-cols-1 sm:grid-cols-2">
                    {randomPokemons !== null && randomPokemons.map((randomPokemon, index) => (
                        <PokemonCard 
                            key={index} 
                            randomPokemon={randomPokemon} 
                            index={index} 
                            locked={locked}
                            usage = {pokemon[randomPokemon]["usage"]["weighted"]}
                            format = {format} 
                            handleImageClick = {handleImageClick}/>
                    ))}
                </div>
            </div>
        </>
    )
}