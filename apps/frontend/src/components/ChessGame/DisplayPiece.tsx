import { ChessPiece, Color } from "@TRPI/core/core-algo";
import React from "react";
import WhitePawn from "../../images/Pieces/WhitePawn.svg";
import WhiteRook from "../../images/Pieces/WhiteRook.svg";
import WhiteKnight from "../../images/Pieces/WhiteKnight.svg";
import WhiteBishop from "../../images/Pieces/WhiteBishop.svg";
import WhiteQueen from "../../images/Pieces/WhiteQueen.svg";
import WhiteKing from "../../images/Pieces/WhiteKing.svg";
import BlackPawn from "../../images/Pieces/BlackPawn.svg";
import BlackRook from "../../images/Pieces/BlackRook.svg";
import BlackKnight from "../../images/Pieces/BlackKnight.svg";
import BlackBishop from "../../images/Pieces/BlackBishop.svg";
import BlackQueen from "../../images/Pieces/BlackQueen.svg";
import BlackKing from "../../images/Pieces/BlackKing.svg";

interface DisplayPieceProps {
  pieceName: ChessPiece | null;
}

const DisplayPiece : React.FC<DisplayPieceProps> = ({pieceName}) => {
  
  if(pieceName === null){
    return null;
  }

  const typePiece : string = pieceName.constructor.name;
  const colorPiece : Color = pieceName.color;

  const piece = (typePiece: string, colorPiece: Color) => {
    switch (typePiece) {
      case "Pawn":
        return colorPiece === Color.White ? WhitePawn : BlackPawn;
      case "Rook":
        return colorPiece === Color.White ? WhiteRook : BlackRook;
      case "Knight":
        return colorPiece === Color.White ? WhiteKnight : BlackKnight;
      case "Bishop":
        return colorPiece === Color.White ? WhiteBishop : BlackBishop;
      case "Queen":
        return colorPiece === Color.White ? WhiteQueen : BlackQueen;
      case "King":
        return colorPiece === Color.White ? WhiteKing : BlackKing;
    }
  };

  return (
    <div className="piece">
      <img src={piece(typePiece,colorPiece)} alt={typePiece} />
    </div>
  );
};

export default DisplayPiece;