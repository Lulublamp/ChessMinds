import { JoinQueuOption } from "../MatchMaking";

export interface IMMPlayer {
  id: string;
  mail: string;
  name: string;
  elo: number;
  options: JoinQueuOption;
}

export interface IRPlayer extends IMMPlayer {
  rank: number | null;
  socketId: string | null;
}