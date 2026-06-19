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
                className="card-container text-white"
                style={{
                    "--type-color": colours.get(primary_type),
                }}> 
                <div
                    className='sm:w-72 sm:h-72 md:w-96 md:h-96 card'>
                    <p>{randomPokemon}</p>

                    {index == 0 ? <p>
                        Usage: {(usage * 100).toFixed(2)}%
                    </p> :
                        <p>
                            Usage : {!locked ? "???" : `${(usage * 100).toFixed(2)}%`}
                        </p>}


                    <img 
                        className='pokemon-image sm:w-56 sm:h-56 md:w-72 md:h-72'
                        onClick={() => {
                        if (!locked) handleImageClick(randomPokemon);
                    }}
                        src={`https://www.smogon.com/dex/media/sprites/xy/${randomPokemon
                            .split(" ")
                            .join("-")
                            .toLowerCase()}.gif`}
                        alt={randomPokemon}
                    />
                </div>
            </div>
        </>
    )
}