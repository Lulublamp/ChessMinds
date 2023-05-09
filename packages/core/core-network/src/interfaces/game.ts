import { JoinQueuOption } from "../MatchMaking";
import { IMMPlayer, IRPlayer } from "./mmplayer";

export interface IGameState {
  state: string;
  winner: IRPlayer | null | undefined;
}

export interface IGame {
  matchId: string;
  matchOptions: JoinQueuOption;
  white_player: IRPlayer | IMMPlayer;
  black_player: IRPlayer | IMMPlayer;
  createdAt: Date;
  state: IGameState;
}