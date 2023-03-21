import { ChessPiece } from '@TRPI/core/core-algo';
import { ClientEventManager, MATCH_MAKING, IN_GAME, IGame } from '@TRPI/core/core-network';
import { Move, ReactSetter } from '@TRPI/core/core-network/src/interfaces/receiveEvents';
import React, { createContext, useContext, useState } from 'react';


type MaybeCM = ClientEventManager<MATCH_MAKING> | null;
type MaybeGM = ClientEventManager<IN_GAME> | null;
type MaybeGame = IGame | null;


interface GameContextData {
  clientManager: MaybeCM;
  gameManager: MaybeGM;
  playerIsWhite: boolean;
  _game: IGame | null;
  movesData: Move[];
  setGameManager: ReactSetter<MaybeGM>;
  setClientManager: ReactSetter<MaybeCM>;
  setMovesData: ReactSetter<Move[]>;
  set_Game: ReactSetter<MaybeGame>;
}

export const GameContext = createContext<GameContextData | undefined>(undefined);

const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export const useClientManager = (): [MaybeCM , ReactSetter<MaybeCM>] => {
  const { clientManager , setClientManager } = useGameContext();
  return [clientManager , setClientManager];
};

export const useGameManager = (): [MaybeGM , ReactSetter<MaybeGM>] => {
  const { gameManager , setGameManager } = useGameContext();
  return [gameManager , setGameManager];
}

export const useGame = (): [MaybeGame , ReactSetter<MaybeGame>] => {
  const { _game , set_Game } = useGameContext();
  return [_game , set_Game];
}

export const usePlayerIsWhite = (): boolean => {
  const {playerIsWhite}  = useGameContext();
  return playerIsWhite;
}

export const useMovesData = (): [Move[] , ReactSetter<Move[]>] => {
  const { movesData , setMovesData } = useGameContext();
  return [movesData , setMovesData];
}
