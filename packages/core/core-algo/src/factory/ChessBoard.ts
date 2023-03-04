import { ChessPiece, Color } from "../pieces/ChessPiece";
import { King } from "../pieces/King";

export class ChessBoard {
  private board: (ChessPiece | null)[][];

  constructor() {
    // Initialise le plateau avec 8 rangées et 8 colonnes, et remplit chaque case avec null
    this.board = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => null)
    );
  }

  public getBoard(): (ChessPiece | null)[][] {
    return this.board;
  }

  public copyBoard(): ChessBoard {
    const newBoard = new ChessBoard();

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        newBoard.board[row][col] = this.board[row][col]?.copyPiece() ?? null;
      }
    }

    return newBoard;
  }

  // Retourne la pièce présente à une position donnée, ou null si la case est vide
  getPieceAt(position: string): ChessPiece | null {
    const [file, rank] = position.split("");
    const row = parseInt(rank) - 1;
    const col = file.charCodeAt(0) - "a".charCodeAt(0);
    return this.board[row][col];
  }

  // Place une pièce à une position donnée
  setPieceAt(position: string, piece: ChessPiece | null) {
    const [file, rank] = position.split("");
    const row = parseInt(rank) - 1;
    const col = file.charCodeAt(0) - "a".charCodeAt(0);
    this.board[row][col] = piece;
  }

  // Retourne true si la position donnée est en dehors du plateau, false sinon
  isOutOfBounds(position: string): boolean {
    const [file, rank] = position.split("");
    const row = parseInt(rank) - 1;
    const col = file.charCodeAt(0) - "a".charCodeAt(0);
    return row < 0 || row > 7 || col < 0 || col > 7;
  }

  // Retourne true si la position donnée est valide, false sinon
  isValidSquare(position: string): boolean {
    if (position === null) return false;
    return !this.isOutOfBounds(position);
  }

  // Déplace une pièce d'une position à une autre
  movePiece(from: string, to: string) {
    const piece = this.getPieceAt(from);
    if (!piece) {
      throw new Error(
        "No piece at the specified position " + from + " to " + to
      );
    }
    this.setPieceAt(from, null);
    this.setPieceAt(to, piece);
    piece.position = to;
  }

  getBlackKing(): King {
    // On parcourt le plateau à la recherche du roi noir
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece instanceof King && piece.color === Color.Black) {
          return piece;
        }
      }
    }
    throw new Error("No black king found");
  }

  getWhiteKing(): King {
    // On parcourt le plateau à la recherche du roi blanc
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece instanceof King && piece.color === Color.White) {
          return piece;
        }
      }
    }
    throw new Error("No white king found");
  }
}