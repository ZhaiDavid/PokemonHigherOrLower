import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const rooms = new Map();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    const user_id = socket.handshake.auth.userId; 
    console.log(`User connected ${user_id}`);

    socket.on("joined-room", async ({roomName, userName, numPokemon}) => {
      const base_url = "https://pkmn.github.io/smogon/data";
      const usage_url = `${base_url}/stats/gen9ou.json`;
      const data = await fetch(usage_url);
      const readData = await data.json();
      const pokemonData = readData['pokemon'];
      const pokemonKeys = Object.keys(pokemonData).filter((name) => 
                                      pokemonData[name]["usage"]["weighted"]*100 > 0.5);

      const set = new Set();
      while (set.size < numPokemon) {
        set.add(Math.floor(Math.random() * pokemonKeys.length));
      }

      if (!rooms.has(roomName)) {
        rooms.set(roomName, {
          pokemons: [...set].map(num => pokemonKeys[num]),
          pokemonData: pokemonData,
          players: [],
          pokemonKeys: pokemonKeys,
          playerScores: new Map(),
          numPokemon: numPokemon
        });
      }

      const roomState = rooms.get(roomName);

      roomState.players.push(socket.id);
      roomState.playerScores.set(socket.id, 0);
      socket.join(roomName);
      console.log(`${user_id} has joined the room`);

      console.log(roomState.pokemons);

      socket.emit("room-state", {
        pokemons: roomState.pokemons,
        pokemonData: roomState.pokemonData,
        pokemonKeys: roomState.pokemonKeys,
        players: roomState.players,
        playerScores: roomState.playerScores,
        numPokemon: roomState.numPokemon
      });


    })

    socket.on("submit-answer", ({player, roomName, answeredCorrectly}) => {
      const roomState = rooms.get(roomName);
      const set = new Set();
       while (set.size < roomState.numPokemon) {
        set.add(Math.floor(Math.random() * roomState.pokemonKeys.length));
      }

      roomState.pokemons = [...set].map(num => roomState.pokemonKeys[num]);
      if (answeredCorrectly) { 
        roomState.playerScores.set(player, roomState.playerScores.get(player)+1);
      }

      io.to(roomName).emit("room-update", {
        pokemons: roomState.pokemons,
      })

      socket.emit("score-update", {
        score: roomState.playerScores.get(socket.id)
      })

    }) 

  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});