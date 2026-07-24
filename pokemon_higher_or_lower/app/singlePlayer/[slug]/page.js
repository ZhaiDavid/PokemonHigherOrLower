import GameComponent from "./_components/GameComponent";

import "./page.css"

export default async function Page({ params }) {
    const param = await params;
    const mode = param.slug

    const base_url = "https://pkmn.github.io/smogon/data";
    const usage_url = `${base_url}/stats/${mode}.json`;
    const data = await fetch(usage_url);
    const readData = await data.json();
    const pokemon = readData['pokemon'];
    const pokemonKeys = Object.keys(pokemon).filter((name) => 
                                                     pokemon[name]["usage"]["weighted"]*100 > 0.5);
    
    return (
        <>
            <div className="box">
                {pokemonKeys?.length > 0 && <GameComponent pokemonKeys={pokemonKeys} pokemon={pokemon} size = {2} />}
            </div>
        </>
    );
}