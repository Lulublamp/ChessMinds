import { ChessGame } from "../factory/ChessGame";
import { ChessPiece } from "./ChessPiece";

export class Rook extends ChessPiece {
  //La logique de validation des mouvements pour une tour (Rook)
  isValidMove(destination: string, game: ChessGame): boolean {
    const board = game.getBoard();
    const [startFile, startRank] = this.position.split("");
    const [endFile, endRank] = destination.split("");

    // Check if the destination is valid
    if (!this.isValidDestination(destination, board)) {
      return false;
    }

    // Check if the rook is moving vertically or horizontally
    if (startFile !== endFile && startRank !== endRank) {
      return false;
    }

    // Check if there are any pieces in the way
    if (!this.isStraightClear(destination, board)) {
      return false;
    }

    /*On vérifie si la position d'arrivée est occupée par une pièce de la même couleur
        En theorie, on ne devrait pas avoir de pièce à la destination 
        Car check dans la fonction makeMove, mais on vérifie quand même*/
    const pieceAtDestination = board.getPieceAt(destination);
    if (
      pieceAtDestination !== null &&
      pieceAtDestination.color === this.color
    ) {
      return false;
    }

    return true;
  }

  getLegalMoves(game: ChessGame): string[] {
    const legalMoves: string[] = [];
    const [file, rank] = this.position.split("");

    // check vertical moves
    for (let i = 1; i <= 8; i++) {
      const destination = file + i.toString();
      if (
        destination !== this.position &&
        this.isValidMove(destination, game)
      ) {
        legalMoves.push(destination);
      }
    }

    // check horizontal moves
    for (let i = "a".charCodeAt(0); i <= "h".charCodeAt(0); i++) {
      const destination = String.fromCharCode(i) + rank;
      if (
        destination !== this.position &&
        this.isValidMove(destination, game)
      ) {
        legalMoves.push(destination);
      }
    }

    return legalMoves;
  }

  public getPieceCode(): string {
    return "r";
  }
}
