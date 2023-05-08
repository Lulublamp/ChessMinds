import { ChessBoard, ChessGame, ChessPiece } from "@TRPI/core/core-algo";
import {
  ClientEventManager,
  MATCH_MAKING,
  IN_GAME,
  IGame,
  eIJoinQueueEvent,
  GAME_END,
  CONNECTION,
} from "@TRPI/core/core-network";
import {
  Move,
  PGinvitations,
  ReactSetter,
} from "@TRPI/core/core-network/src/interfaces/receiveEvents";
import React, { createContext, useContext, useState } from "react";

type MaybeSG = ClientEventManager<CONNECTION> | null;

interface PrivateGameContextData {}

export const PrivateGameContext = createContext<
  PrivateGameContextData | undefined
>(undefined);

const usePrivateGameContext = () => {
  const context = useContext(PrivateGameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
