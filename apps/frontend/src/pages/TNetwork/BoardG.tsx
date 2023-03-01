import * as React from "react";
import { useState, FC, useEffect, useRef } from "react";
import { ClientEventManager , MM_RANKED , NAMESPACE_TYPES , eIJoinQueueEvent, MM_UNRANKED, Match } from '@TRPI/core/core-network/index';
import './TNetwork.css'
import { ChessGame, ChessPiece } from "@TRPI/core/core-algo";


export interface IBoardGProps {
  chessGame: Match;
}

const BoardG: FC<{_: Match}> = (props: {_: Match}) : any => {

  console.log(props);
  console.log(props._)
  console.log(props._.players)

  const [board , setBoard] = useState<((ChessPiece | null)[][])>(props._.chessGame.getBoard().getBoard());
  props._.chessGame.

  return (
    board
    &&
    <div id="BoardG">
      {
        board.map((row , i) => {
          return (
            <div className="row">
              {
                row.map((piece , j) => {
                  return (
                    <div className="square">
                      {
                        piece
                        &&
                        <div className="piece">
                          {piece.toString()}
                        </div>
                      }
                    </div>
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  );
  
};

export default BoardG;
