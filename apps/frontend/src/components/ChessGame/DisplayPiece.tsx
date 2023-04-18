/* eslint-disable @next/next/no-img-element */
import { Bishop, ChessPiece, Color, King, Knight, Pawn, Queen, Rook } from "@TRPI/core/core-algo";
import React from "react";
import WhitePawn from "../../images/WhitePawn.png";
import WhiteRook from "../../images/WhiteRook.png";
import WhiteKnight from "../../images/WhiteKnight.png";
import WhiteBishop from "../../images/WhiteBishop.png";
import WhiteQueen from "../../images/WhiteQueen.png";
import WhiteKing from "../../images/WhiteKing.png";
import BlackPawn from "../../images/BlackPawn.png";
import BlackRook from "../../images/BlackRook.png";
import BlackKnight from "../../images/BlackKnight.png";
import BlackBishop from "../../images/BlackBishop.png";
import BlackQueen from "../../images/BlackQueen.png";
import BlackKing from "../../images/BlackKing.png";

interface DisplayPieceProps {
  pieceName: ChessPiece | null;
}

const DisplayPiece : React.FC<DisplayPieceProps> = ({pieceName}) => {
  
  if(pieceName === null){
    return null;
  }

  const typePiece : string = pieceName.constructor.name;
  const colorPiece : Color = pieceName.color;

  const piece = (colorPiece: Color , pieceName: ChessPiece): string => {
    if (pieceName instanceof Pawn) {
      return colorPiece === Color.White ? WhitePawn : BlackPawn;
    } else if (pieceName instanceof Rook) {
      return colorPiece === Color.White ? WhiteRook : BlackRook;
    } else if (pieceName instanceof Knight) {
      return colorPiece === Color.White ? WhiteKnight : BlackKnight;
    } else if (pieceName instanceof Bishop) {
      return colorPiece === Color.White ? WhiteBishop : BlackBishop;
    } else if (pieceName instanceof Queen) {
      return colorPiece === Color.White ? WhiteQueen : BlackQueen;
    } else if (pieceName instanceof King) {
      return colorPiece === Color.White ? WhiteKing : BlackKing;
    } else {
      return "";
    }

  };

  const srcP = piece(colorPiece , pieceName);

  return (
    <div className="piece">
      <img src={srcP} alt={typePiece} />
    </div>
  );
};

export default DisplayPiece;