import { Server } from "socket.io";
import { Game, rooms } from "./classes/game";

export function setupListeners(io: Server) {
  io.on("connection", (socket) => {
    console.log(`New connection - ${socket.id}`);

    socket.on("join-game", (roomId: string, name: string) => {
      if (!roomId) return socket.emit("error", "Room ID is required");
      if (!name) return socket.emit("error", "Name is required");

      socket.join(roomId);

      if (rooms.has(roomId)) {
        const game = rooms.get(roomId)!;
        game.joinPlayer(socket.id, name, socket);
      } else {
        const game = new Game(roomId, io, socket.id);
        rooms.set(roomId, game);
        game.joinPlayer(socket.id, name, socket);
      }
    });
  });
}
