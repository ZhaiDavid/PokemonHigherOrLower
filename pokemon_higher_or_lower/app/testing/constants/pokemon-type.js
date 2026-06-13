import { Dex } from "@pkmn/dex";

export const pokemon_types_map = new Map();

const base_url = "https://pokeapi.co/api/v2/pokemon/?limit=10000";

// still needed ONLY to get list of names once
const res = await fetch(base_url);
const pokemon_data = await res.json();

pokemon_data.results.forEach((a) => {
  const mon = Dex.species.get(a.name.split(" ")
                        .join("-")
                        .toLowerCase());

  pokemon_types_map.set(
    a.name.split(" ")
                        .join("-")
                        .toLowerCase(),
    mon.types
  );
});

console.log(pokemon_types_map)