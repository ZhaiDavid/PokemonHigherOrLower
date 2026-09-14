import { io } from "socket.io-client";

const serverUrl = process.env.SERVER_URL || "http://localhost:3000";
const roomCount = Number(process.env.ROOM_COUNT || 1000);
const format = process.env.FORMAT || "gen9ou";
const numPokemon = Number(process.env.NUM_POKEMON || 2);
const timeoutMs = Number(process.env.TIMEOUT_MS || 30000);
const holdMs = Number(process.env.HOLD_MS || 10000);

if (!Number.isInteger(roomCount) || roomCount < 1) {
  throw new Error("ROOM_COUNT must be a positive integer");
}

function connectPlayer(roomNumber, playerNumber) {
  return new Promise((resolve, reject) => {
    const userId = `load-test-${roomNumber}-${playerNumber}`;
    const roomName = `load-test-room-${roomNumber}`;
    const socket = io(serverUrl, {
      auth: { userId },
      transports: ["websocket"],
      reconnection: false,
    });

    let settled = false;
    const timer = setTimeout(() => {
      finish(new Error(`Timed out waiting for room-state in ${roomName}`));
    }, timeoutMs);

    function finish(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.removeAllListeners();
      socket.disconnect();
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    }

    socket.once("connect_error", (error) => finish(error));
    socket.once("connect", () => {
      socket.emit("joined-room", {
        roomName,
        userName: userId,
        numPokemon,
        format,
      });
    });
    socket.once("room-state", () => finish());
    socket.once("game-full", () => finish(new Error(`${roomName} reported game-full`)));
  });
}

async function testRoom(roomNumber) {
  await Promise.all([
    connectPlayer(roomNumber, 1),
    connectPlayer(roomNumber, 2),
  ]);
}

const startedAt = Date.now();
let completed = 0;
const failures = [];

console.log(`Starting ${roomCount} rooms (${roomCount * 2} clients) against ${serverUrl}`);

await Promise.all(
  Array.from({ length: roomCount }, async (_, index) => {
    try {
      await testRoom(index + 1);
      completed += 1;
      if (completed % 100 === 0 || completed === roomCount) {
        console.log(`Ready: ${completed}/${roomCount}`);
      }
    } catch (error) {
      failures.push({ room: index + 1, message: error.message });
    }
  }),
);

const elapsedMs = Date.now() - startedAt;
console.log(`Room setup completed in ${(elapsedMs / 1000).toFixed(2)}s`);
console.log(`Successful rooms: ${completed}/${roomCount}`);
console.log(`Failed rooms: ${failures.length}`);

if (failures.length > 0) {
  console.error(JSON.stringify(failures.slice(0, 20), null, 2));
  process.exitCode = 1;
} else {
  console.log(`Holding successful connections for ${holdMs}ms`);
  await new Promise((resolve) => setTimeout(resolve, holdMs));
}