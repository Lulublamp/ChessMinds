import { ChessGame } from "../factory/ChessGame";
import { ChessPiece } from "./ChessPiece";

export class Bishop extends ChessPiece {
  // Logique de validation des mouvements pour le fou
  isValidMove(destination: string, game: ChessGame): boolean {
    const board = game.getBoard();

    // Check if the destination is valid
    if (!this.isValidDestination(destination, board)) {
      return false;
    }

    // On calcule la distance horizontale et verticale entre la case de départ et la case d'arrivée
    const [startFile, startRank] = this.position.split("");
    const [endFile, endRank] = destination.split("");
    const horizontalDistance = Math.abs(
      +endFile.charCodeAt(0) - +startFile.charCodeAt(0)
    );
    const verticalDistance = Math.abs(+endRank - +startRank);

    // On vérifie que le déplacement se fait en diagonale
    if (horizontalDistance !== verticalDistance) {
      return false;
    }

    // On vérifie que le chemin est dégagé
    if (!this.isDiagonalClear(destination, board)) {
      return false;
    }

    return true;
  }

  getLegalMoves(game: ChessGame): string[] {
    const board = game.getBoard();
    const [startFile, startRank] = this.position.split("");
    const legalMoves: string[] = [];

    // On parcourt les 4 diagonales possibles à partir de la position de départ
    for (let i = -1; i <= 1; i += 2) {
      for (let j = -1; j <= 1; j += 2) {
        let steps = 1;
        while (true) {
          const destinationFile = String.fromCharCode(
            startFile.charCodeAt(0) + steps * i
          );
          const destinationRank = parseInt(startRank) + steps * j;
          const destination = `${destinationFile}${destinationRank}`;

          // Si la destination est invalide ou le mouvement n'est pas légal, on sort de la boucle
          if (!this.isValidMove(destination, game)) {
            break;
          }

          // Si la destination est valide et le mouvement est légal, on ajoute la destination à la liste de coups légaux
          legalMoves.push(destination);

          // Si la case est occupée, on sort de la boucle car le fou ne peut pas sauter par-dessus une autre pièce
          if (board.getPieceAt(destination) !== null) {
            break;
          }

          // On incrémente le nombre de pas pour passer à la case suivante sur la diagonale
          steps++;
        }
      }
    }

    return legalMoves;
  }

  public getPieceCode(): string {
    return "b";
  }
}