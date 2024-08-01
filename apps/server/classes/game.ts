import { Server, Socket } from "socket.io";
import { generateParagraph } from "../utils/generateParagraph";
import { getAccuracy, getScore, getSpeed } from "../utils/getStatistics";

export const rooms = new Map<string, Game>();

export class Game {
  gameStatus: "not-started" | "in-progress" | "finished";
  gameId: string;
  players: {
    id: string;
    name: string;
    score: number;
    speed: number;
    accuracy: number;
  }[];
  gameHost: string;
  startTime: number;
  paragraph: string;
  io: Server;

  constructor(id: string, io: Server, host: string) {
    this.gameId = id;
    this.gameStatus = "not-started";
    this.players = [];
    this.gameHost = host;
    this.startTime = Date.now();
    this.paragraph = "";
    this.io = io;
  }

  setupListeners(socket: Socket) {
    socket.on("start-game", async () => {
      if (this.gameStatus === "in-progress")
        return socket.emit("error", "Game is already in progress!");

      if (this.gameHost !== socket.id)
        return socket.emit(
          "error",
          "You are not the host, only gameHost can start the game!"
        );

      for (const player of this.players) {
        player.score = 0;
      }

      this.io.to(this.gameId).emit("players", this.players);

      this.gameStatus = "in-progress";

      this.paragraph = await generateParagraph();

      this.io.to(this.gameId).emit("game-started", this.paragraph);

      setTimeout(() => {
        this.gameStatus = "finished";
        this.io.to(this.gameId).emit("game-finished", this.players);
      }, 60000);
    });

    socket.on("player-typed", (words: string) => {
      if (this.gameStatus !== "in-progress")
        return socket.emit("error", "Game is not in progress!");

			const score = getScore(words, this.paragraph);
			const accuracy = getAccuracy(score, words);
			const speed = getSpeed(this.startTime, words);
      
      this.players.forEach((player) => {
        if (player.id === socket.id) {
          player.score = score;
          player.speed = speed;
          player.accuracy = accuracy;
        }
      });

      this.io.to(this.gameId).emit("player-score", {
        id: socket.id,
        score,
				speed,
				accuracy,
      });
    });

    socket.on("disconnect", () => {
      if (socket.id === this.gameHost) {
        this.players = this.players.filter((player) => player.id !== socket.id);

        if (this.players.length !== 0) {
          // there is still someone in the room and change the host
          this.gameHost = this.players[0].id;
          this.io.to(this.gameId).emit("game-host", this.gameHost);
        } else {
          // there is nobody in the room
          rooms.delete(this.gameId);
        }
      } else {
        this.players = this.players.filter((player) => player.id !== socket.id);
      }

      socket.leave(this.gameId);
      this.io.to(this.gameId).emit("player-left", socket.id);
    });

    socket.on("leave-game", () => {
      if (socket.id === this.gameHost) {
        this.players = this.players.filter((player) => player.id !== socket.id);

        if (this.players.length !== 0) {
          // there is still someone in the room and change the host
          this.gameHost = this.players[0].id;
          this.io.to(this.gameId).emit("game-host", this.gameHost);
        } else {
          // there is nobody in the room
          rooms.delete(this.gameId);
        }
      } else {
        this.players = this.players.filter((player) => player.id !== socket.id);
      }

      socket.leave(this.gameId);
      this.io.to(this.gameId).emit("player-left", socket.id);
    });
  }

  joinPlayer(id: string, name: string, socket: Socket) {
    if (this.gameStatus === "in-progress")
      return socket.emit(
        "error",
        "Game is already in progress please wait for the game to finish!"
      );

    this.players.push({ id, name, score: 0, speed: 0, accuracy: 100 });

    this.io
      .to(this.gameId)
      .emit("player-joined", this.players[this.players.length - 1]);
    socket.emit("players", this.players);
    socket.emit("game-host", this.gameHost);

    this.setupListeners(socket);
  }
}
