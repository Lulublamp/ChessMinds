import { ChessBoard } from "../factory/ChessBoard";
import { ChessGame } from "../factory/ChessGame";
import { ChessPiece, Color } from "./ChessPiece";

export class Pawn extends ChessPiece {
  private doubleMove: boolean = false;

  //La logique de validation des mouvements pour un pion (Pawn)
  isValidMove(destination: string, game: ChessGame): boolean {
    const board: ChessBoard = game.getBoard();
    // Check if the destination is valid
    if (!this.isValidDestination(destination, board)) {
      return false;
    }

    // On calcule la distance horizontale et verticale entre la position de départ et la position d'arrivée
    const [startFile, startRank] = this.position.split("");
    const [endFile, endRank] = destination.split("");
    const horizontalDistance = Math.abs(
      +endFile.charCodeAt(0) - +startFile.charCodeAt(0)
    );
    const verticalDistance = Math.abs(+endRank - +startRank);
    const pieceAtDestination = board.getPieceAt(destination);

    if (this.color === Color.White) {
      // Les pions blancs se déplacent vers le haut
      if (+endRank - +startRank < 0) {
        return false;
      }

      // Les pions blancs peuvent se déplacer d'une case en avant, sauf s'ils sont bloqués
      if (
        horizontalDistance === 0 &&
        verticalDistance === 1 &&
        pieceAtDestination === null
      ) {
        return true;
      }

      // Les pions blancs peuvent se déplacer de deux cases en avant s'ils sont sur leur rang de départ
      if (
        horizontalDistance === 0 &&
        verticalDistance === 2 &&
        startRank === "2" &&
        pieceAtDestination === null
      ) {
        // On vérifie que la case intermédiaire est libre
        const intermediateSquare = startFile + (+startRank + 1);
        const pieceAtIntermediateSquare = board.getPieceAt(intermediateSquare);
        if (pieceAtIntermediateSquare !== null) {
          return false;
        }
        this.doubleMove = true;
        return true;
      }

      // Les pions blancs peuvent se déplacer en diagonale pour capturer une pièce ennemie
      if (
        horizontalDistance === 1 &&
        verticalDistance === 1 &&
        pieceAtDestination !== null &&
        pieceAtDestination.color === Color.Black
      ) {
        return true;
      }

      // Prise en passant
      const leftPiece = board.getPieceAt(
        String.fromCharCode(startFile.charCodeAt(0) - 1) + startRank
      );
      const rightPiece = board.getPieceAt(
        String.fromCharCode(startFile.charCodeAt(0) + 1) + startRank
      );
      if (
        leftPiece !== null &&
        leftPiece instanceof Pawn &&
        leftPiece.color === Color.Black &&
        leftPiece.doubleMove &&
        endFile === String.fromCharCode(startFile.charCodeAt(0) - 1)
      ) {
        return true;
      } else if (
        rightPiece !== null &&
        rightPiece instanceof Pawn &&
        rightPiece.color === Color.Black &&
        rightPiece.doubleMove &&
        endFile === String.fromCharCode(startFile.charCodeAt(0) + 1)
      ) {
        return true;
      }

      // Les pions blancs ne peuvent pas se déplacer en arrière ou en diagonale sans capturer une pièce ennemie
      return false;
    } else {
      // Les pions noirs se déplacent vers le bas
      if (+endRank - +startRank > 0) {
        return false;
      }

      // Les pions noirs peuvent se déplacer d'une case en avant, sauf s'ils sont bloqués
      if (
        horizontalDistance === 0 &&
        verticalDistance === 1 &&
        pieceAtDestination === null
      ) {
        return true;
      }

      // Les pions noirs peuvent se déplacer de deux cases en avant s'ils sont sur leur rang de départ
      if (
        horizontalDistance === 0 &&
        verticalDistance === 2 &&
        startRank === "7" &&
        pieceAtDestination === null
      ) {
        // On vérifie que la case intermédiaire est libre
        const intermediateSquare = startFile + (+startRank - 1);
        const pieceAtIntermediateSquare = board.getPieceAt(intermediateSquare);
        if (pieceAtIntermediateSquare !== null) {
          return false;
        }
        this.doubleMove = true;
        return true;
      }

      // Les pions noirs peuvent se déplacer en diagonale pour capturer une pièce ennemie
      if (
        horizontalDistance === 1 &&
        verticalDistance === 1 &&
        pieceAtDestination !== null &&
        pieceAtDestination.color === Color.White
      ) {
        return true;
      }

      // Prise en passant
      const leftPiece = board.getPieceAt(
        String.fromCharCode(startFile.charCodeAt(0) - 1) + startRank
      );
      const rightPiece = board.getPieceAt(
        String.fromCharCode(startFile.charCodeAt(0) + 1) + startRank
      );
      if (
        leftPiece !== null &&
        leftPiece instanceof Pawn &&
        leftPiece.color === Color.White &&
        leftPiece.doubleMove &&
        endFile === String.fromCharCode(startFile.charCodeAt(0) - 1)
      ) {
        return true;
      } else if (
        rightPiece !== null &&
        rightPiece instanceof Pawn &&
        rightPiece.color === Color.White &&
        rightPiece.doubleMove &&
        endFile === String.fromCharCode(startFile.charCodeAt(0) + 1)
      ) {
        return true;
      }

      // Les pions noirs ne peuvent pas se déplacer en arrière ou en diagonale sans capturer une pièce ennemie
      return false;
    }
  }

  public resetDoubleMove() {
    this.doubleMove = false;
  }

  getLegalMoves(game: ChessGame): string[] {
    const legalMoves: string[] = [];
    const [file, rank] = this.position.split("");
    const direction = this.color === Color.White ? 1 : -1; // Le pion blanc avance vers le haut, le pion noir avance vers le bas
    const forward1 = file + (Number(rank) + direction);
    const forward2 = file + (Number(rank) + 2 * direction);
    const left =
      String.fromCharCode(file.charCodeAt(0) - 1) + (Number(rank) + direction);
    const right =
      String.fromCharCode(file.charCodeAt(0) + 1) + (Number(rank) + direction);

    if (this.isValidMove(forward1, game)) {
      legalMoves.push(forward1);
      if (this.isValidMove(forward2, game)) {
        legalMoves.push(forward2);
      }
    }

    if (this.isValidMove(left, game)) {
      legalMoves.push(left);
    }

    if (this.isValidMove(right, game)) {
      legalMoves.push(right);
    }

    return legalMoves;
  }
}