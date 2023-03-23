import { ChessBoard } from "../factory/ChessBoard";
import { ChessGame } from "../factory/ChessGame";

export enum Color {
  White,
  Black,
}

export abstract class ChessPiece {
  constructor(public color: Color, public position: string) {}
  abstract isValidMove(destination: string, game: ChessGame): boolean;
  abstract getLegalMoves(game: ChessGame): string[];

  // Vérifie si le chemin est libre pour un déplacement en ligne droite
  protected isStraightClear(destination: string, board: ChessBoard): boolean {
    const [startFile, startRank] = this.position.split("");
    const [endFile, endRank] = destination.split("");

    // On vérifie si le déplacement se fait horizontalement
    if (startRank === endRank) {
      const fileDirection = endFile > startFile ? 1 : -1;
      for (
        let file = startFile.charCodeAt(0) + fileDirection;
        file !== endFile.charCodeAt(0);
        file += fileDirection
      ) {
        const currentSquare = String.fromCharCode(file) + startRank;
        if (board.getPieceAt(currentSquare) !== null) {
          return false;
        }
      }
    }

    // On vérifie si le déplacement se fait verticalement
    if (startFile === endFile) {
      const rankDirection = endRank > startRank ? 1 : -1;
      for (
        let rank = +startRank + rankDirection;
        rank !== +endRank;
        rank += rankDirection
      ) {
        const currentSquare = startFile + rank;
        if (board.getPieceAt(currentSquare) !== null) {
          return false;
        }
      }
    }

    return true;
  }

  // Vérifie si le chemin est libre pour un déplacement en diagonale
  protected isDiagonalClear(destination: string, board: ChessBoard): boolean {
    const [startFile, startRank] = this.position.split("");
    const [endFile, endRank] = destination.split("");

    const fileDirection = endFile > startFile ? 1 : -1;
    const rankDirection = endRank > startRank ? 1 : -1;
    for (
      let file = startFile.charCodeAt(0) + fileDirection,
        rank = +startRank + rankDirection;
      file !== endFile.charCodeAt(0);
      file += fileDirection, rank += rankDirection
    ) {
      const currentSquare = String.fromCharCode(file) + rank;
      if (board.getPieceAt(currentSquare) !== null) {
        return false;
      }
    }

    return true;
  }

  protected isValidDestination(
    destination: string,
    board: ChessBoard
  ): boolean {
    // On vérifie si la position d'arrivée est valide
    if (!board.isValidSquare(destination)) {
      return false;
    }

    // On vérifie si la position d'arrivée est différente de la position de départ
    if (destination === this.position) {
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

  public copyPiece(): ChessPiece {
    return new (this.constructor as any)(this.color, this.position);
  }
}


