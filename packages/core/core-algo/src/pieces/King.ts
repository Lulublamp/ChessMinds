import { ChessGame } from "../factory/ChessGame";
import { ChessPiece , Color } from "./ChessPiece";


export class King extends ChessPiece {
  // Logique de validation des mouvements pour le roi
  isValidMove(destination: string, game: ChessGame): boolean {
    const board = game.getBoard();

    // Check if the destination is valid
    if (!this.isValidDestination(destination, board)) {
      return false;
    }

    // Calculer la distance entre la case de départ et la case d'arrivée
    const [startFile, startRank] = this.position.split("");
    const [endFile, endRank] = destination.split("");
    const dx = Math.abs(+endFile.charCodeAt(0) - +startFile.charCodeAt(0));
    const dy = Math.abs(+endRank - +startRank);

    // Vérifier si le déplacement est valide pour le roi
    if (
      (dx === 1 && dy === 0) ||
      (dx === 0 && dy === 1) ||
      (dx === 1 && dy === 1)
    ) {
      // Vérifier si le déplacement n'entraîne pas le roi dans une situation d'échec
      if (!this.isKingInCheck(destination, game)) {
        return true;
      }
    }

    // Vérifier si le roi peut effectuer un roque
    if (game.canRoqueKingSide(this.color) && destination === "g1") {
      //Les cases entre le roi et la tour doivent être vides
      if (board.getPieceAt("f1") === null && board.getPieceAt("g1") === null) {
        //Le roi ne doit pas être en échec
        if (!this.isKingInCheck("e1", game)) {
          //La case entre le roi et la tour ne doit pas être attaquée par une pièce adverse
          if (
            !this.isKingInCheck("f1", game) &&
            !this.isKingInCheck("g1", game)
          ) {
            return true;
          }
        }
      }
    }

    if (game.canRoqueQueenSide(this.color) && destination === "c1") {
      //Les cases entre le roi et la tour doivent être vides
      if (
        board.getPieceAt("b1") === null &&
        board.getPieceAt("c1") === null &&
        board.getPieceAt("d1") === null
      ) {
        //Le roi ne doit pas être en échec
        if (!this.isKingInCheck("e1", game)) {
          //La case entre le roi et la tour ne doit pas être attaquée par une pièce adverse
          if (
            !this.isKingInCheck("c1", game) &&
            !this.isKingInCheck("d1", game)
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // Vérifier si le roi est en échec
  isKingInCheck(destination: string, game: ChessGame): boolean {
    // Copier le jeu
    const gameCopy = game.CopyGame();

    // Déplacer le roi sur le nouveau plateau
    gameCopy.getBoard().movePiece(this.position, destination);

    // Vérifier si le roi est en échec sur le nouveau plateau
    const board = gameCopy.getBoard();
    const oppenentColor = this.color === Color.White ? Color.Black : Color.White;
    const opponentPieces = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board.getPieceAt(`${String.fromCharCode(97 + i)}${j + 1}`);
        if (piece !== null && piece.color === oppenentColor) {
          opponentPieces.push(piece);
        }
      }
    }
  
    for (let i = 0; i < opponentPieces.length; i++) {
      if (opponentPieces[i].isValidMove(destination, gameCopy)) {
        return true;
      }
    }

    return false;
  }

  getLegalMoves(game: ChessGame): string[] {
    const [startFile, startRank] = this.position.split("");
    const legalMoves: string[] = [];

    // On parcourt les 8 directions possibles à partir de la position de départ
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        const destinationFile = String.fromCharCode(
          startFile.charCodeAt(0) + i
        );
        const destinationRank = parseInt(startRank) + j;
        const destination = `${destinationFile}${destinationRank}`;

        // Si la destination est valide et le mouvement est légal, on ajoute la destination à la liste de coups légaux
        if (this.isValidMove(destination, game)) {
          legalMoves.push(destination);
        }
      }
    }

    // Vérifier si le roi peut effectuer un petit roque
    if (game.canRoqueKingSide(this.color)) {
      const destination = this.color === Color.White ? "g1" : "g8";
      if (this.isValidMove(destination, game)) {
        legalMoves.push(destination);
      }
    }

    // Vérifier si le roi peut effectuer un grand roque
    if (game.canRoqueQueenSide(this.color)) {
      const destination = this.color === Color.White ? "c1" : "c8";
      if (this.isValidMove(destination, game)) {
        legalMoves.push(destination);
      }
    }

    return legalMoves;
  }
}