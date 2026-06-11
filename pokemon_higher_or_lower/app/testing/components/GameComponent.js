"use client";
import { useEffect, useState} from "react";
import PokemonCard from "./PokemonCard";


export default function GameComponent ({pokemonKeys, pokemon, size}) {
    useEffect(() => {
        setRandomPokemons(generateRandomPokemons());
    }, [pokemonKeys]);

    useEffect(() => {
        const localHighScore = localStorage.getItem("high-score")
        setHighScore(localHighScore === null ? 0 : localHighScore)
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
                        localStorage.setItem("high-score", score);
                    }
                    handleClick();
                    }, 1000);
    }
    
    return (
        <>  
            <p>High Score: {highScore}</p>
            <p>Score: {score}</p>
            <p>Random {randomPokemons}</p>
            <p>{pokemonKeys}</p>
            <div>
                {randomPokemons !== null && randomPokemons.map((randomPokemon, index) => (
                    <>
                    <PokemonCard key={index} randomPokemon={randomPokemon} index={index} locked={locked} />
                    </>
                ))}
            </div>
        </>
    )
}