import { CardWithForm } from "@/components/global/CardWithForm";
import Game from "@/components/global/Game";

export default function page({
  params,
  searchParams,
}: {
  params: { gameid: string };
  searchParams: { name?: string };
}) {
  if (!searchParams.name) return <CardWithForm gameId={params.gameid} />;

  return <Game gameId={params.gameid} name={searchParams.name} />;
}
