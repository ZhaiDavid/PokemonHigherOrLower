export default function PokemonCard(randomPokemon, index, locked) {
    randomPokemon = randomPokemon.toString();

    return (
        <>
            <div>
                <p>{randomPokemon}</p>

                {index == 0 ? <p>
                    Usage: {(pokemon[randomPokemon]["usage"]["weighted"] * 100).toFixed(2)}%
                </p> :
                    <p>
                        Usage : {!locked ? "???" : `${(pokemon[randomPokemon]["usage"]["weighted"] * 100).toFixed(2)}%`}
                    </p>}


                <img onClick={() => {
                    if (!locked) handleImageClick(randomPokemon);
                }}
                    width="100px"
                    height="100px"
                    src={`https://www.smogon.com/dex/media/sprites/xy/${randomPokemon?
                        .split(" ")
                        .join("-")
                        .toLowerCase()}.gif`}
                    alt={randomPokemon}
                />
            </div>
        </>
    )
}