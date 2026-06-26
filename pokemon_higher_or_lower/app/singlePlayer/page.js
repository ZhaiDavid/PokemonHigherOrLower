import GameComponent from "./components/GameComponent";
import SiteHeader from "../components/SiteHeader";

import "./page.css"

export default async function Page() {
    const base_url = "https://pkmn.github.io/smogon/data";
    const usage_url = `${base_url}/stats/gen9ou.json`;
    const data = await fetch(usage_url);
    const readData = await data.json();
    const pokemon = readData['pokemon'];
    const pokemonKeys = Object.keys(pokemon).filter((name) => 
                                                     pokemon[name]["usage"]["weighted"]*100 > 0.5);
    
    return (
        <>
            <div className="box">
                <SiteHeader />
                {pokemonKeys?.length > 0 && <GameComponent pokemonKeys={pokemonKeys} pokemon={pokemon} size = {2} />}
            </div>
        </>
    );
}