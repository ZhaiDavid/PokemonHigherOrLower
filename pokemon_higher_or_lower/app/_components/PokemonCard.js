import { colours } from '../constants/pokemon-type-colours.js'
import { pokemon_types_map } from '../constants/pokemon-type.js'
import "./PokemonCard.css";

export default function PokemonCard({ randomPokemon, index, locked, usage, format, handleImageClick }) {
    const types = pokemon_types_map.get(randomPokemon.split(" ")
        .join("-")
        .toLowerCase());
    const primary_type = types[0].toLowerCase();
    const gen = format.charAt(3);
    let tag = "";
    if (gen == 1) {
        tag = "rb";
    } else if (gen == 2) {
        tag = "c";
    } else if (gen == 3) {
        tag = "rs";
    } else if (gen == 4) {
        tag = "dp";
    } else if (gen == 5) {
        tag = "bw";
    } else {;
        tag = "xy";
    }
    return (
        <>

            <div
                className="card-container text-white"
                style={{
                    "--type-color": colours.get(primary_type),
                }}>
                <div
                    className='sm:w-72 sm:h-72 md:w-96 md:h-96 card'>
                    <p className='card-pokemon-label'>{randomPokemon}</p>

                    {index == 0 ? <p className='card-pokemon-usage'>
                        Usage: {(usage * 100).toFixed(2)}%
                    </p> :
                        <p className='card-pokemon-usage'>
                            Usage : {!locked ? "???" : `${(usage * 100).toFixed(2)}%`}
                        </p>}


                    <img
                        className='pokemon-image sm:w-56 sm:h-56 md:w-72 md:h-72'
                        onClick={() => {
                            if (!locked) handleImageClick(randomPokemon);
                        }}
                        src={`https://www.smogon.com/dex/media/sprites/${tag}/${randomPokemon
                            .split(" ")
                            .join("-")
                            .toLowerCase()}.${(gen == 1 || gen == 3 || gen == 4)? 'png': 'gif'}`}
                        alt={randomPokemon}
                    />
                </div>
            </div>
        </>
    )
}