import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

import Queue from './Queue.js'
import { formatsList } from "./app/constants/formats.js";

const rooms = new Map();
const user_socket = new Map(); // maps every user_id in queue to its socket
const user_routes = new Map(); // maps every user_id to it's game query if it is in game
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// Temporary function to create unique room ids
// https://stackoverflow.com/questions/66946239/how-to-create-an-unique-room-room-id-in-socket-io-for-two-users


// Separating into functions so that I can reuse
function changeRoomPokemon(roomName, gameTimerMap, io) {
    const roomState = rooms.get(roomName);
    if (!roomState) return;


    const set = new Set();
      while (set.size < roomState.numPokemon) {
      set.add(Math.floor(Math.random() * roomState.pokemonKeys.length));
    }

    roomState.pokemons = [...set].map(num => roomState.pokemonKeys[num]);

    // Incrementing Question Number
    roomState.questionNumber += 1;

    // Check if game is ended
    if (roomState.questionNumber > 15) {
      if (gameTimerMap.has(roomName)) {
        clearInterval(gameTimerMap.get(roomName));
        gameTimerMap.delete(roomName);
      }

      // Check which ID has the most people
      let maxScoreID = "";
      let maxScore = Number.MIN_SAFE_INTEGER;

      roomState.playerIDs.forEach((id) => {
        let score = roomState.playerScores.get(id);
        if (score > maxScore) {
          maxScore = score;
          maxScoreID = id;
        }
      })

      roomState.playerIDs.forEach((id) => {
        if (user_socket.get(id)) {
          user_socket.get(id).emit("game-over");
          if (id == maxScoreID) {
            user_socket.get(id).emit("win");
          }
        }
        else {
          console.log("Error");
        }
      })

      //  TODO: Remove room and usersockets
      // Removing user sockets from map after the room has been closed
      roomState.playerIDs.forEach((id) => {
        if (user_socket.has(id)) {
          user_socket.delete(id);
        }
        if (user_routes.has(id)) {
          user_routes.delete(id);
        }
      })
      if (rooms.has(roomName)) {
        rooms.delete(roomName);
      }


    } else {
      io.to(roomName).emit("room-update", {
        pokemons: roomState.pokemons,
        questionNumber: roomState.questionNumber
      })
    }
}

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  // Separate map of queues for each format, so they players can queue up for their desired format
  const queueMap = new Map();
  formatsList.forEach((format, index) => {
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

        const roomId = crypto.randomUUID();
        
        socket1.emit("match-found", {
          roomName: roomId
        });
        socket2.emit("match-found", {
          roomName: roomId
        })

        console.log(`Created room ${roomId}`)
      }
    })

    socket.on("in-matchmaking", () => {
      socket.emit("in-queue", {
        inQueue: user_socket.has(user_id)
      })
    })

    // Handling Room Joining
    socket.on("joined-room", async ({roomName, userName, numPokemon, format}) => {
      const base_url = "https://pkmn.github.io/smogon/data";
      const usage_url = `${base_url}/stats/${format}.json`;
      const data = await fetch(usage_url);
      const readData = await data.json();
      const pokemonData = readData['pokemon'];
      const pokemonKeys = Object.keys(pokemonData).filter((name) => 
                                      pokemonData[name]["usage"]["weighted"]*100 > 0.5);

      // Also setting the socket map here in case the user doesn't join through the queue
      user_socket.set(user_id, socket);

      // Setting the query in the routes map
      user_routes.set(user_id, new URLSearchParams({ roomName, userName, format }).toString());

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

      // Do not allow extra player to play if the room size is already 2 or more
      if (roomState.playerIDs.size >= 2 && !roomState.playerIDs.has(user_id)) {
        socket.emit("game-full");
        return;
      }
      else {
        console.log(roomState.playerIDs);
      }

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

      // Send user their userID
      socket.emit("user-id", {
        userID: user_id
      });
      console.log(`${user_id} emitted`)


      socket.join(roomName);

      socket.emit("room-state", {
        pokemons: roomState.pokemons,
        pokemonData: roomState.pokemonData,
        playerScore: roomState.playerScores.get(user_id),
        roomScores: Array.from(roomState.playerScores),
        playerUsernames: Array.from(roomState.playerUsernames),
        questionNumber: roomState.questionNumber
      });

      console.log(`room: ${roomName}`);
      console.log(roomState.playerIDs);

      // Emitting Score Update to each room upon joining to display all users on scoreboard
      if (roomState.playerIDs.size > 1) {
        console.log("2+ PLAYERS");
        io.to(roomName).emit("ready-to-start-match");

        roomState.playerIDs.forEach((id) => {
          if (user_socket.get(id)) {
            // console.log("SENT " + id);
            console.log(roomState.playerScores);
            user_socket.get(id).emit("score-update", {
              playerUsernames: Object.fromEntries(roomState.playerUsernames),
              roomScore: Object.fromEntries(roomState.playerScores)
            })
          }
          else {
            console.log("Error");
          }
        })

        // Run Timer if more than one player
        function changePokemonInterval() {
          changeRoomPokemon(roomName, gameTimerMap, io);
        }

       if (!gameTimerMap.has(roomName)) {
        setTimeout(
          () => {
            if (gameTimerMap.get(roomName) == 0) {
              changePokemonInterval();
              gameTimerMap.set(roomName, setInterval(changePokemonInterval, 6000));
            }
          }, 5000);
       }
       gameTimerMap.set(roomName, 0); // filler, just to indicate that someone has joined

        
      }
    })

    // Handling Check to see if you are already in game
    socket.on("in-match-check", () => {
      if (user_routes.has(user_id)) {
        socket.emit("already-in-match", {
          query: user_routes.get(user_id)
        })
      }
    })

    // Multiplayer Answer Submission
    socket.on("submit-answer", ({roomName, answeredCorrectly}) => {
      clearInterval(gameTimerMap.get(roomName));
      const roomState = rooms.get(roomName);
      changeRoomPokemon(roomName, gameTimerMap, io);

      if (answeredCorrectly) { 
        roomState.playerScores.set(user_id, roomState.playerScores.get(user_id)+1);
      }

      socket.to(roomName).emit("user-submitted", {
        user: user_id,
        answeredCorrectly: answeredCorrectly
      })

      console.log("someone answered");


      // socket.emit("score-update", {
      //   score: roomState.playerScores.get(user_id),
      //   : Object.fromEntries(roomState.playerScores)
      // })
      roomState.playerIDs.forEach((id) => {
        if (user_socket.get(id)) {
          console.log("SENT " + id);
          user_socket.get(id).emit("score-update", {
            playerUsernames: Object.fromEntries(roomState.playerUsernames),
            roomScore: Object.fromEntries(roomState.playerScores)
          })
        }
        else {
          console.log("Error");
        }
      })

      // Re-adding timer
      function changePokemonInterval() {
        changeRoomPokemon(roomName, gameTimerMap, io);
      }
      gameTimerMap.set(roomName, setInterval(changePokemonInterval, 6000));
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