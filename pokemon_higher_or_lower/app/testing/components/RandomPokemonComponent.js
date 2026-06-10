"use client";
import { useEffect, useState} from "react";


export default function RandomPokemonComponent ({pokemonKeys, pokemon, size}) {
    useEffect(() => {
                setRandomPokemons(generateRandomPokemons());
                }, []);
    const [randomPokemons, setRandomPokemons] = useState(null);
    const [locked, setLocked] = useState(false);
    const [score, setScore] = useState(0);


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
                    handleClick();
                    }, 1000);
    }
        
    
    return (
        <>
            Score: {score}
            {randomPokemons && randomPokemons.map((randomPokemon, index) => (
                <div key={randomPokemon}>
                    <p>{randomPokemon}</p>

                    {index == 0 ? <p>
                                    Usage: {(pokemon[randomPokemon]["usage"]["weighted"] * 100).toFixed(2)}%
                                  </p>:
                                  <p>
                                    Usage : {!locked? "???": `${(pokemon[randomPokemon]["usage"]["weighted"]*100).toFixed(2)}%`}
                                  </p>}
                    

                    <img onClick = {() => {
                        if (!locked) handleImageClick(randomPokemon);
                    }}
                    width="100px"
                    height = "100px"
                    src={`https://www.smogon.com/dex/media/sprites/xy/${randomPokemon
                        .split(" ")
                        .join("-")
                        .toLowerCase()}.gif`}
                    />
                </div>
            ))}
        </>
    )
}