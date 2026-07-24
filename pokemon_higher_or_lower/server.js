import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

import Queue from './Queue.js'
import { modesList } from "./app/constants/modes.js";

const rooms = new Map();
const user_socket = new Map(); // maps every user_id in queue to its socket
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// Temporary function to create unique room ids
// https://stackoverflow.com/questions/66946239/how-to-create-an-unique-room-room-id-in-socket-io-for-two-users
function createRoomID(id1, id2) {
  return id1.toString(10).padStart(10, "0") + id2.toString(10).padStart(10, "0")
}

// Separating into functions so that I can reuse
function changeRoomPokemon(roomName, io) {
    const roomState = rooms.get(roomName);
    const set = new Set();
      while (set.size < roomState.numPokemon) {
      set.add(Math.floor(Math.random() * roomState.pokemonKeys.length));
    }

    roomState.pokemons = [...set].map(num => roomState.pokemonKeys[num]);

    // Incrementing Question Number
    roomState.questionNumber += 1;

    io.to(roomName).emit("room-update", {
      pokemons: roomState.pokemons,
      questionNumber: roomState.questionNumber
    })
}

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  // Separate map of queues for each format, so they players can queue up for their desired format
  const queueMap = new Map();
  modesList.forEach((format, index) => {
    queueMap[format] = new Queue();
  })

  const gameTimerMap = new Map();

  io.on("connection", (socket) => {
    const user_id = socket.handshake.auth.userId; 
    console.log(`User connected ${user_id}`);

    // Handling Matchmaking
    socket.on("match-search", async (format) => {
      if (!user_socket.has(user_id)) {
        queueMap[format].enqueue(user_id);
      }

      user_socket.set(user_id, socket);

      console.log(`${user_id} is in queue`);
      console.log(queueMap[format].getSize());
      
      if (queueMap[format].getSize() >= 2) {
        
        const user_id1 = queueMap[format].dequeue();
        const user_id2 = queueMap[format].dequeue();
        const socket1 = user_socket.get(user_id1);
        const socket2 = user_socket.get(user_id2);
        
        socket1.emit("match-found", {
          roomName: createRoomID(socket1.id, socket2.id),
        });
        socket2.emit("match-found", {
          roomName: createRoomID(socket1.id, socket2.id),
        })

        console.log(`Created room ${createRoomID(socket1.id, socket2.id)}`)
      }
    })

    socket.on("in-matchmaking", () => {
      socket.emit("in-queue", {
        inQueue: user_socket.has(user_id)
      })
    })

    // Handling Room Joining
    socket.on("joined-room", async ({roomName, userName, numPokemon}) => {
      const base_url = "https://pkmn.github.io/smogon/data";
      const usage_url = `${base_url}/stats/gen9ou.json`;
      const data = await fetch(usage_url);
      const readData = await data.json();
      const pokemonData = readData['pokemon'];
      const pokemonKeys = Object.keys(pokemonData).filter((name) => 
                                      pokemonData[name]["usage"]["weighted"]*100 > 0.5);

      // Also setting the socket map here in case the user doesn't join through the queue
      user_socket.set(user_id, socket);

      const set = new Set();
      while (set.size < numPokemon) {
        set.add(Math.floor(Math.random() * pokemonKeys.length));
      }

      if (!rooms.has(roomName)) {
        rooms.set(roomName, {
          pokemons: [...set].map(num => pokemonKeys[num]),
          pokemonData: pokemonData,
          pokemonKeys: pokemonKeys,
          playerIDs: new Set(),
          playerScores: new Map(),
          playerUsernames: new Map(),
          numPokemon: numPokemon,
          questionNumber: 1
        });
      }

      const roomState = rooms.get(roomName);

      if (!roomState.playerIDs.has(user_id)) {
          roomState.playerIDs.add(user_id);
      }

      if (!roomState.playerScores.has(user_id)) {
        roomState.playerScores.set(user_id, 0);
      }

      if (!roomState.playerUsernames.has(user_id)) {
        const username = (userName == "" ? "Anonymous" : userName);
        roomState.playerUsernames.set(user_id, username);
      }


      socket.join(roomName);
      console.log(`${user_id} has joined the room`);

      socket.emit("room-state", {
        pokemons: roomState.pokemons,
        pokemonData: roomState.pokemonData,
        playerScore: roomState.playerScores.get(user_id),
        roomScores: Array.from(roomState.playerScores),
        playerUsernames: Array.from(roomState.playerUsernames),
        questionNumber: roomState.questionNumber
      });

      // Emitting Score Update to each room upon joining to display all users on scoreboard
      if (roomState.playerIDs.size > 1) {
        console.log("MORE THAN 2 PLAYERS");
        roomState.playerIDs.forEach((id) => {
          if (user_socket.get(id)) {
            console.log("SENT " + id);
            console.log(roomState.playerScores);
            user_socket.get(id).emit("score-update", {
              score: roomState.playerScores.get(user_id),
              roomScore: Object.fromEntries(roomState.playerScores)
            })
          }
          else {
            console.log("Error");
          }
        })

        // Run Timer if more than one player
        function changePokemonInterval() {
          changeRoomPokemon(roomName, io);
        }
        gameTimerMap.set(roomName, setInterval(changePokemonInterval, 5000));
      }
    })

    // Multiplayer Answer Submission
    socket.on("submit-answer", ({roomName, answeredCorrectly}) => {
      clearInterval(gameTimerMap.get(roomName));
      const roomState = rooms.get(roomName);
      changeRoomPokemon(roomName, io);

      if (answeredCorrectly) { 
        roomState.playerScores.set(user_id, roomState.playerScores.get(user_id)+1);
      }

      socket.to(roomName).emit("user-submitted", {
        user: user_id,
        answeredCorrectly: answeredCorrectly
      })

      console.log(user_id);
      console.log(answeredCorrectly);


      // socket.emit("score-update", {
      //   score: roomState.playerScores.get(user_id),
      //   : Object.fromEntries(roomState.playerScores)
      // })
      roomState.playerIDs.forEach((id) => {
        if (user_socket.get(id)) {
          console.log("SENT " + id);
          user_socket.get(id).emit("score-update", {
            score: roomState.playerScores.get(user_id),
            roomScore: Object.fromEntries(roomState.playerScores)
          })
        }
        else {
          console.log("Error");
        }
      })

      // Re-adding timer
      function changePokemonInterval() {
        changeRoomPokemon(roomName, io);
      }
      gameTimerMap.set(roomName, setInterval(changePokemonInterval, 5000));
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