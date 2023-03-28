import { Color, ChessPiece } from "../pieces/ChessPiece";
import { King } from "../pieces/King";
import { ChessGame } from "./ChessGame";

export class Player {
  color: Color;
  pieces: ChessPiece[];

  constructor(color: Color) {
    this.color = color;
    this.pieces = [];
  }

  addPiece(piece: ChessPiece) {
    this.pieces.push(piece);
  }

  resetPieces() {
    this.pieces = [];
  }

  removePiece(piece: ChessPiece) {
    let index = 0;
    for (let i = 0; i < this.pieces.length; i++) {
      if (this.pieces[i].position === piece.position) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      this.pieces.splice(index, 1);
    }
  }

  getPieces(): ChessPiece[] {
    return this.pieces.slice();
  }

  getKing(): King {
    return this.pieces.find((piece) => piece instanceof King) as King;
  }

  public copyPlayer(): Player {
    const newPlayer = new Player(this.color);
    this.pieces.forEach((piece) => {
      const newPiece = piece.copyPiece();
      newPlayer.addPiece(newPiece);
    });
    return newPlayer;
  }
}
