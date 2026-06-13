import { colours } from '../constants/pokemon-type-colours.js'
import { pokemon_types_map } from  '../constants/pokemon-type.js'

export default function PokemonCard({randomPokemon, index, locked, usage, handleImageClick}) {
    const types = pokemon_types_map.get(randomPokemon.split(" ")
                        .join("-")
                        .toLowerCase());
    console.log(types);
    //document.documentElement.style.setProperty("--type-color", colours.get("primary_type"));
    return (
        <>
            
            <div>
                <p>{randomPokemon}</p>

                {index == 0 ? <p>
                    Usage: {(usage * 100).toFixed(2)}%
                </p> :
                    <p>
                        Usage : {!locked ? "???" : `${(usage * 100).toFixed(2)}%`}
                    </p>}


                <img onClick={() => {
                    if (!locked) handleImageClick(randomPokemon);
                }}
                    width="100px"
                    height="100px"
                    src={`https://www.smogon.com/dex/media/sprites/xy/${randomPokemon
                        .split(" ")
                        .join("-")
                        .toLowerCase()}.gif`}
                    alt={randomPokemon}
                />
            </div>
        </>
    )
}