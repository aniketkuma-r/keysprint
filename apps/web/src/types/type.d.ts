export type Player = {
  id: string;
  name: string;
  score: number;
  speed: number;
  accuracy: number;
};

export type GameStatus = "not-started" | "in-progress" | "finished";

export type GameProps = {
    name : string;
    gameId: string;
}

export type PlayerScoreProps = {
  id: string;
  score: number;
  speed: number;
  accuracy: number;
};