"use client";

import type {
  GameProps,
  GameStatus,
  Player,
  PlayerScoreProps,
} from "@/types/type";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CopyIcon } from "@radix-ui/react-icons";
import LeaderBoard from "./LeaderBoard";
import { ResultTable } from "./ResultTable";
import { Textarea } from "../ui/textarea";
import CountdownTimer from "./CountdownTimer";

export default function Game({ gameId, name }: GameProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>("not-started");
  const [gameHost, setGameHost] = useState<string>("");
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [paragraph, setParagraph] = useState<string>("");
  const [inputParagraph, setInputParagraph] = useState<string>("");

  useEffect(() => {
    const _socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL! as string, {
      transports: ["websocket"],
    });
    setSocket(_socket);
    _socket.connect();
    _socket.emit("join-game", gameId, name);

    return () => {
      removeListeners();
      _socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setUpListeners();
    return () => removeListeners();
  }, [socket]);

  useEffect(() => {
    if (!socket || gameStatus !== "in-progress") return;
    socket?.emit("player-typed", inputParagraph);
  }, [inputParagraph]);

  function setUpListeners() {
    if (!socket) return;

    socket.on("error", (error: string) => toast(error));

    socket.on("game-host", (gameHostId: string) => setGameHost(gameHostId));

    socket.on("game-started", (paragraph: string) => {
      setParagraph(paragraph);
      setInputParagraph("");
      setGameStatus("in-progress");
    });

    socket.on("game-finished", () => {
      setParagraph("");
      setGameStatus("finished");
    });

    socket.on("players", (players: Player[]) => {
      setPlayers(players);
      players.forEach((player) =>
        player.id === socket.id ? setCurrentPlayer(player) : {}
      );
    });

    socket.on("player-joined", (player: Player) => {
      if (socket.id === player.id) setCurrentPlayer(player);
      setPlayers((prev) => [...prev, player]);
      toast(`${player.name}`, {
        description: "New Player Joined in the Room.",
      });
    });

    socket.on("player-left", (playerId: string) => {
      setPlayers((prev) => prev.filter((player) => player.id !== playerId));
      toast(`${playerId}`, {
        description: "Player Left the Room.",
      });
    });

    socket.on(
      "player-score",
      ({ id, score, speed, accuracy }: PlayerScoreProps) => {
        setPlayers((prev) =>
          prev.map((player) => {
            const updatedPlayer =
              id === player.id ? { ...player, score, speed, accuracy } : player;

            if (id === socket.id) setCurrentPlayer(updatedPlayer);
            return updatedPlayer;
          })
        );
      }
    );
  }
  function removeListeners() {
    if (!socket) return;

    socket.off("error");
    socket.off("game-host");
    socket.off("game-started");
    socket.off("game-finished");
    socket.off("players");
    socket.off("player-joined");
    socket.off("player-left");
    socket.off("player-score");
  }

  function StartGame() {
    if (!socket || gameStatus === "in-progress") return;
    socket?.emit("start-game");
  }

  window.onbeforeunload = () => {
    if (!socket) return;
    socket?.emit("leave-game");
  };

  return (
    <div>
      {gameStatus !== "in-progress" && (
        <div className="flex justify-center p-2">
          <div className="z-10 w-full max-w-5xl items-center text-sm lg:flex gap-2">
            <p className="font-medium">Share Invite Code: </p>
            <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 font-mono">
              {gameId}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(gameId);
                toast("copied to clipboard");
              }}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {gameStatus === "in-progress" && (
        <div className="flex flex-col items-center justify-between">
          <CountdownTimer initialMinutes={0} initialSeconds={59} />

          <div className="z-10 w-full max-w-5xl items-center justify-between flex px-10">
            <div className="border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800  dark:from-inherit static w-auto  rounded-xl border bg-gray-200 p-4 dark:bg-zinc-800/30">
              <h1>Current Speed: {currentPlayer?.speed}</h1>
            </div>
            <div className="">
              <h1>Accuracy: {currentPlayer?.accuracy}</h1>
            </div>
          </div>
        </div>
      )}

      <div className="w-screen p-4 lg:px-20 grid lg:grid-cols-4 sm:grid-cols-1 gap-3">
        <div className="lg:col-span-3 mt-10">
          {gameStatus === "not-started" && (
            <div className="flex flex-col items-center justify-center p-10 gap-10">
              {gameHost !== socket?.id && (
                <h1 className="text-2xl font-bold">
                  Waiting for Players to Join and Host to Start...
                </h1>
              )}
              {gameHost === socket?.id && (
                <>
                  <h1 className="text-2xl font-bold">
                    Waiting for Players to Join...
                  </h1>
                  <Button variant={"secondary"} size={"lg"} onClick={StartGame}>
                    Start Game
                  </Button>
                </>
              )}
            </div>
          )}

          {gameStatus === "in-progress" && (
            <div className="h-full relative">
              <pre className="text-xl p-5 tracking-wide text-wrap opacity-50 select-none">
                <code>{paragraph}</code>
              </pre>
              <code>
                <Textarea
                  value={inputParagraph}
                  onChange={(e) => setInputParagraph(e.target.value)}
                  placeholder=""
                  className="text-xl p-5 tracking-wide text-wrap absolute z-10 inset-0 border-none"
                  disabled={gameStatus !== "in-progress" || !socket}
                />
              </code>
            </div>
          )}

          {gameStatus === "finished" && (
            <div className="flex flex-col items-center justify-center p-10 gap-10">
              <ResultTable players={players} playerId={socket?.id} />

              {gameHost === socket?.id && (
                <>
                  <h1 className="text-2xl font-bold">
                    Waiting for Players to Join...
                  </h1>
                  <Button variant={"secondary"} size={"lg"} onClick={StartGame}>
                    Restart Game
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <LeaderBoard players={players} playerId={socket?.id} />
      </div>
    </div>
  );
}
