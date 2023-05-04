import { ChessGame } from "../factory/ChessGame";
import { ChessPiece } from "./ChessPiece";

export class Knight extends ChessPiece {
  // Logique de validation des mouvements pour le cavalier
  isValidMove(destination: string, game: ChessGame): boolean {
    const board = game.getBoard();

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

    // Le cavalier doit se déplacer de deux cases horizontalement et une case verticalement, ou de deux cases verticalement et une case horizontalement
    if (
      !(
        (horizontalDistance === 2 && verticalDistance === 1) ||
        (horizontalDistance === 1 && verticalDistance === 2)
      )
    ) {
      return false;
    }

    return true;
  }

  getLegalMoves(game: ChessGame): string[] {
    const board = game.getBoard();
    const [startFile, startRank] = this.position.split("");
    const legalMoves: string[] = [];

    // On parcourt toutes les cases autour du cavalier
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        if (Math.abs(i * j) === 2) {
          // Si la case est à une distance de 2 cases horizontalement et 1 case verticalement ou 2 cases verticalement et 1 case horizontalement
          const destinationFile = String.fromCharCode(
            startFile.charCodeAt(0) + i
          );
          const destinationRank = parseInt(startRank) + j;
          if (destinationRank >= 1 && destinationRank <= 8) {
            // Vérification que le rang est valide
            const destination = `${destinationFile}${destinationRank}`;

            // Si la destination est valide et le mouvement est légal, on ajoute la destination à la liste de coups légaux
            if (
              this.isValidDestination(destination, board) &&
              this.isValidMove(destination, game)
            ) {
              legalMoves.push(destination);
            }
          }
        }
      }
    }
    return legalMoves;
  }

  public getPieceCode(): string {
    return "n";
  }

  
}