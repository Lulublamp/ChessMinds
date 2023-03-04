import { Color, ChessPiece } from "../pieces/ChessPiece";
import { King } from "../pieces/King";

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

  removePiece(piece: ChessPiece) {
    const index = this.pieces.indexOf(piece);
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
    this.pieces.forEach((piece) => newPlayer.addPiece(piece.copyPiece()));
    return newPlayer;
  }
}