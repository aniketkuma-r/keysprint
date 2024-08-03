import { Player } from "@/types/type";

export default function LeaderBoard({
  players,
  playerId,
}: {
  players: Player[];
  playerId: string | undefined;
}) {
  return (
    <div className="lg:col-end-5 mt-10 border rounded-md">
      <h2 className="text-xl font-medium p-4 border-b-2">Standings</h2>
      {players &&
        players
          .sort((a, b) => b.score - a.score)
          .map((player, index) => (
            <div
              key={player?.id}
              className={`w-full p-2 flex justify-between gap-2 ${playerId! === player?.id ? "bg-secondary/50" : ""}`}
            >
              <h1 className="font-bold text-lg">
                #{index + 1} - {player?.name}
              </h1>
              <h2 className="font-semibold">{player?.score}</h2>
            </div>
          ))}
    </div>
  );
}
