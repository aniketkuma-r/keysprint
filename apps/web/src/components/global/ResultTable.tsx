import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Player } from "@/types/type";

export function ResultTable({
  players,
  playerId,
}: {
  players: Player[];
  playerId: string | undefined;
}) {
  return (
    <Table>
      <TableCaption>Final Standings...</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Speed (WPM)</TableHead>
          <TableHead className="text-right">Accuracy</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players &&
          players
            .sort((a, b) => b.score - a.score)
            .map((player) => (
              <TableRow
                key={player?.id}
                className={`${playerId === player?.id ? "bg-secondary/20" : ""}`}
              >
                <TableCell className="font-medium">{player?.name}</TableCell>
                <TableCell>{player?.score}</TableCell>
                <TableCell>{player?.speed}</TableCell>
                <TableCell className="text-right">
                  {player?.accuracy} %
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Winner</TableCell>
          <TableCell colSpan={2} className="text-center text-lg">
            🥇 {players && players[0]?.name} 🎉✨
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
