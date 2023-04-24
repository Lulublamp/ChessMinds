import { JoinQueuOption } from "../MatchMaking";
import { IRPlayer } from "./mmplayer";

export interface IGameState {
  state: string;
  winner: IRPlayer | null | undefined;
}

export interface IGame {
  matchId: string;
  matchOptions: JoinQueuOption;
  white_player: IRPlayer;
  black_player: IRPlayer;
  createdAt: Date;
  state: IGameState;
}