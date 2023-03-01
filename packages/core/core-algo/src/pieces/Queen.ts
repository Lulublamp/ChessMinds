import { ChessGame } from "../factory/ChessGame";
import { ChessPiece } from "./ChessPiece";

export class Queen extends ChessPiece {
  // Logique de validation des mouvements pour la reine
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

    // La reine peut se déplacer horizontalement, verticalement et en diagonale
    if (
      horizontalDistance !== 0 &&
      verticalDistance !== 0 &&
      horizontalDistance !== verticalDistance
    ) {
      return false;
    }

    // On vérifie si le chemin est libre pour un déplacement en ligne droite
    if (horizontalDistance === 0 || verticalDistance === 0) {
      if (!this.isStraightClear(destination, board)) return false;
    }

    // On vérifie si le chemin est libre pour un déplacement en diagonale
    if (horizontalDistance === verticalDistance) {
      if (!this.isDiagonalClear(destination, board)) return false;
    }

    return true;
  }

  getLegalMoves(game: ChessGame): string[] {
    const board = game.getBoard();
    const [startFile, startRank] = this.position.split("");
    const legalMoves: string[] = [];

    // On parcourt les 8 directions possibles à partir de la position de départ
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
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

          // Si la case est occupée, on sort de la boucle car la reine ne peut pas sauter par-dessus une autre pièce
          if (board.getPieceAt(destination) !== null) {
            break;
          }

          // On incrémente le nombre de pas pour passer à la case suivante dans la direction
          steps++;
        }
      }
    }

    return legalMoves;
  }
}