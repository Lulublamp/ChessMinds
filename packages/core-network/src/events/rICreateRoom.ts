import { eICreateRoomEvent } from "./eICreateRoom";
import ChessGame  from "@TRPI/core";

export interface rICreateRoomEvent extends eICreateRoomEvent {
  game: ChessGame;
}