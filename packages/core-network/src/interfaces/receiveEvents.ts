import { eICreateRoomEvent } from "./emitEvents";
import ChessGame  from "@TRPI/core";

export interface rICreateRoomEvent extends eICreateRoomEvent {
  game: ChessGame;
}