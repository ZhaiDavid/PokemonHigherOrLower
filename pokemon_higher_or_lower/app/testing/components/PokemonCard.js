import { colours } from '../constants/pokemon-type-colours.js'
import { pokemon_types_map } from  '../constants/pokemon-type.js'
import "./PokemonCard.css";

export default function PokemonCard({randomPokemon, index, locked, usage, handleImageClick}) {
    const types = pokemon_types_map.get(randomPokemon.split(" ")
                        .join("-")
                        .toLowerCase());
    const primary_type = types[0].toLowerCase();
    return (
        <>
            
            <div
                className="card"
                style={{
                    "--type-color": colours.get(primary_type),
                }}> 
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