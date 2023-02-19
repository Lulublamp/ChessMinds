enum Color {
    White,
    Black,
}
  
abstract class ChessPiece {

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
            for (let file = startFile.charCodeAt(0) + fileDirection; file !== endFile.charCodeAt(0); file += fileDirection) {
                const currentSquare = String.fromCharCode(file) + startRank;
                if (board.getPieceAt(currentSquare) !== null) {
                    return false;
                }
            }
        }

        // On vérifie si le déplacement se fait verticalement
        if (startFile === endFile) {
            const rankDirection = endRank > startRank ? 1 : -1;
            for (let rank = +startRank + rankDirection; rank !== +endRank; rank += rankDirection) {
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
        for (let file = startFile.charCodeAt(0) + fileDirection, rank = +startRank + rankDirection; file !== endFile.charCodeAt(0); file += fileDirection, rank += rankDirection) {
            const currentSquare = String.fromCharCode(file) + rank;
            if (board.getPieceAt(currentSquare) !== null) {
                return false;
            }
        }

        return true;
    }

    protected isValidDestination(destination: string, board: ChessBoard): boolean {
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
        if (pieceAtDestination !== null && pieceAtDestination.color === this.color) {
            return false;
        }
        return true;
    }

    public copyPiece(): ChessPiece {
        return new (this.constructor as any)(this.color, this.position);
    }
}
  
class Pawn extends ChessPiece {

    private doubleMove: boolean = false;

    //La logique de validation des mouvements pour un pion (Pawn) 
    isValidMove(destination: string, game: ChessGame): boolean {
       
        const board : ChessBoard = game.getBoard();
        // Check if the destination is valid 
        if(!this.isValidDestination(destination, board)) {
            return false;
        }
        
        // On calcule la distance horizontale et verticale entre la position de départ et la position d'arrivée
        const [startFile, startRank] = this.position.split("");
        const [endFile, endRank] = destination.split("");
        const horizontalDistance = Math.abs(+endFile.charCodeAt(0) - +startFile.charCodeAt(0));
        const verticalDistance = Math.abs(+endRank - +startRank);
        const pieceAtDestination = board.getPieceAt(destination);

        if (this.color === Color.White) {
            // Les pions blancs se déplacent vers le haut
            if (+endRank - +startRank < 0) {
                return false;
            }

            // Les pions blancs peuvent se déplacer d'une case en avant, sauf s'ils sont bloqués
            if (horizontalDistance === 0 && verticalDistance === 1 && pieceAtDestination === null) {
                return true;
            }

            // Les pions blancs peuvent se déplacer de deux cases en avant s'ils sont sur leur rang de départ
            if (horizontalDistance === 0 && verticalDistance === 2 && startRank === "2" && pieceAtDestination === null) {
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
            if (horizontalDistance === 1 && verticalDistance === 1 && pieceAtDestination !== null && pieceAtDestination.color === Color.Black) {
                return true;
            }

            // Prise en passant
            const leftPiece = board.getPieceAt(String.fromCharCode(startFile.charCodeAt(0) - 1) + startRank);
            const rightPiece = board.getPieceAt(String.fromCharCode(startFile.charCodeAt(0) + 1) + startRank);
            if (leftPiece !== null && leftPiece instanceof Pawn && leftPiece.color === Color.Black && leftPiece.doubleMove && endFile === String.fromCharCode(startFile.charCodeAt(0) - 1)) {
                return true;
            } else if (rightPiece !== null && rightPiece instanceof Pawn && rightPiece.color === Color.Black && rightPiece.doubleMove && endFile === String.fromCharCode(startFile.charCodeAt(0) + 1)) {
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
            if (horizontalDistance === 0 && verticalDistance === 1 && pieceAtDestination === null) {
                return true;
            }

            // Les pions noirs peuvent se déplacer de deux cases en avant s'ils sont sur leur rang de départ
            if (horizontalDistance === 0 && verticalDistance === 2 && startRank === "7" && pieceAtDestination === null) {
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
            if (horizontalDistance === 1 && verticalDistance === 1 && pieceAtDestination !== null && pieceAtDestination.color === Color.White) {
                return true;
            }

            // Prise en passant
            const leftPiece = board.getPieceAt(String.fromCharCode(startFile.charCodeAt(0) - 1) + startRank);
            const rightPiece = board.getPieceAt(String.fromCharCode(startFile.charCodeAt(0) + 1) + startRank);
            if (leftPiece !== null && leftPiece instanceof Pawn && leftPiece.color === Color.White && leftPiece.doubleMove && endFile === String.fromCharCode(startFile.charCodeAt(0) - 1)) {
                return true;
            } else if (rightPiece !== null && rightPiece instanceof Pawn && rightPiece.color === Color.White && rightPiece.doubleMove && endFile === String.fromCharCode(startFile.charCodeAt(0) + 1)) {
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
        const direction = (this.color === Color.White) ? 1 : -1; // Le pion blanc avance vers le haut, le pion noir avance vers le bas
        const forward1 = file + (Number(rank) + direction);
        const forward2 = file + (Number(rank) + 2*direction);
        const left = String.fromCharCode(file.charCodeAt(0) - 1) + (Number(rank) + direction);
        const right = String.fromCharCode(file.charCodeAt(0) + 1) + (Number(rank) + direction);

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

class Rook extends ChessPiece {
    
    //La logique de validation des mouvements pour une tour (Rook) 
    isValidMove(destination: string, game: ChessGame): boolean {

        const board = game.getBoard();
        const [startFile, startRank] = this.position.split("");
        const [endFile, endRank] = destination.split("");
        
        // Check if the destination is valid 
        if(!this.isValidDestination(destination, board)) {
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
        if (pieceAtDestination !== null && pieceAtDestination.color === this.color) {
            return false;
        }
                
        return true;
    }

    getLegalMoves(game: ChessGame): string[] {
        const legalMoves = [];
        const [file, rank] = this.position.split("");
    
        // check vertical moves
        for (let i = 1; i <= 8; i++) {
            const destination = file + i.toString();
            if (destination !== this.position && this.isValidMove(destination, game)) {
                legalMoves.push(destination);
            }
        }
    
        // check horizontal moves
        for (let i = "a".charCodeAt(0); i <= "h".charCodeAt(0); i++) {
            const destination = String.fromCharCode(i) + rank;
            if (destination !== this.position && this.isValidMove(destination, game)) {
                legalMoves.push(destination);
            }
        }
    
        return legalMoves;
    }
}

class Knight extends ChessPiece {

    // Logique de validation des mouvements pour le cavalier
    isValidMove(destination: string, game: ChessGame): boolean {

        const board = game.getBoard();

        // Check if the destination is valid 
        if(!this.isValidDestination(destination, board)) {
            return false;
        }

        // On calcule la distance horizontale et verticale entre la position de départ et la position d'arrivée
        const [startFile, startRank] = this.position.split("");
        const [endFile, endRank] = destination.split("");
        const horizontalDistance = Math.abs(+endFile.charCodeAt(0) - +startFile.charCodeAt(0));
        const verticalDistance = Math.abs(+endRank - +startRank);

        // Le cavalier doit se déplacer de deux cases horizontalement et une case verticalement, ou de deux cases verticalement et une case horizontalement
        if (!((horizontalDistance === 2 && verticalDistance === 1) || (horizontalDistance === 1 && verticalDistance === 2))) {
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
                if (Math.abs(i * j) === 2) { // Si la case est à une distance de 2 cases horizontalement et 1 case verticalement ou 2 cases verticalement et 1 case horizontalement
                    const destinationFile = String.fromCharCode(startFile.charCodeAt(0) + i);
                    const destinationRank = parseInt(startRank) + j;
                    if (destinationRank >= 1 && destinationRank <= 8) { // Vérification que le rang est valide
                        const destination = `${destinationFile}${destinationRank}`;
    
                        // Si la destination est valide et le mouvement est légal, on ajoute la destination à la liste de coups légaux
                        if (this.isValidDestination(destination, board) && this.isValidMove(destination, game)) {
                            legalMoves.push(destination);
                        }
                    }
                }
            }
        }
    
        return legalMoves;
    }
}

class Bishop extends ChessPiece {

    // Logique de validation des mouvements pour le fou
    isValidMove(destination: string, game: ChessGame): boolean {

        const board = game.getBoard();

        // Check if the destination is valid 
        if(!this.isValidDestination(destination, board)) {
            return false;
        }

        // On calcule la distance horizontale et verticale entre la case de départ et la case d'arrivée
        const [startFile, startRank] = this.position.split("");
        const [endFile, endRank] = destination.split("");
        const horizontalDistance = Math.abs(+endFile.charCodeAt(0) - +startFile.charCodeAt(0));
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
                    const destinationFile = String.fromCharCode(startFile.charCodeAt(0) + (steps * i));
                    const destinationRank = parseInt(startRank) + (steps * j);
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
}

class Queen extends ChessPiece {

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
        const horizontalDistance = Math.abs(+endFile.charCodeAt(0) - +startFile.charCodeAt(0));
        const verticalDistance = Math.abs(+endRank - +startRank);

        // La reine peut se déplacer horizontalement, verticalement et en diagonale
        if (horizontalDistance !== 0 && verticalDistance !== 0 && horizontalDistance !== verticalDistance) {
            return false;
        }

        // On vérifie si le chemin est libre pour un déplacement en ligne droite
        if (horizontalDistance === 0 || verticalDistance === 0) {
            if (!this.isStraightClear(destination, board))
                return false;
        }

        // On vérifie si le chemin est libre pour un déplacement en diagonale
        if (horizontalDistance === verticalDistance) {
            if (!this.isDiagonalClear(destination, board)) 
                return false;
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
                        const destinationFile = String.fromCharCode(startFile.charCodeAt(0) + (steps * i));
                        const destinationRank = parseInt(startRank) + (steps * j);
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

class King extends ChessPiece {

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
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1) || (dx === 1 && dy === 1)) {
            // Vérifier si le déplacement n'entraîne pas le roi dans une situation d'échec
            if (!this.isKingInCheck(destination, game)) {
                return true;
            }
        }

        // Vérifier si le roi peut effectuer un roque   
        if(game.canRoqueKingSide(this.color) && destination === "g1") { 
            //Les cases entre le roi et la tour doivent être vides
            if(board.getPieceAt("f1") === null && board.getPieceAt("g1") === null) {
                //Le roi ne doit pas être en échec
                if(!this.isKingInCheck("e1", game)) {
                    //La case entre le roi et la tour ne doit pas être attaquée par une pièce adverse
                    if(!this.isKingInCheck("f1", game) && !this.isKingInCheck("g1", game)) {
                        return true;
                    }
                }
            }
        }  
        
        if(game.canRoqueQueenSide(this.color) && destination === "c1") {
            //Les cases entre le roi et la tour doivent être vides
            if(board.getPieceAt("b1") === null && board.getPieceAt("c1") === null && board.getPieceAt("d1") === null) {
                //Le roi ne doit pas être en échec
                if(!this.isKingInCheck("e1", game)) {
                    //La case entre le roi et la tour ne doit pas être attaquée par une pièce adverse
                    if(!this.isKingInCheck("c1", game) && !this.isKingInCheck("d1", game)) {
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
        const opponent = gameCopy.getPlayer(this.color === Color.White ? Color.Black : Color.White);
        const opponentPieces = opponent.getPieces();

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
                const destinationFile = String.fromCharCode(startFile.charCodeAt(0) + i);
                const destinationRank = parseInt(startRank) + j;
                const destination = `${destinationFile}${destinationRank}`;

                // Si la destination est valide et le mouvement est légal, on ajoute la destination à la liste de coups légaux
                if (this.isValidMove(destination, game)) {
                    legalMoves.push(destination);
                }
            }
        }

        // Vérifier si le roi peut effectuer un petit roque
        if(game.canRoqueKingSide(this.color)) {
            const destination = this.color === Color.White ? "g1" : "g8";
            if(this.isValidMove(destination, game)) {
                legalMoves.push(destination);
            }
        }

        // Vérifier si le roi peut effectuer un grand roque
        if(game.canRoqueQueenSide(this.color)) {
            const destination = this.color === Color.White ? "c1" : "c8";
            if(this.isValidMove(destination, game)) {
                legalMoves.push(destination);
            }
        }
    
        return legalMoves;
    }
}
  
class Player 
{
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
        return this.pieces.find(piece => piece instanceof King) as King;
    }

    public copyPlayer(): Player {
        const newPlayer = new Player(this.color);
        this.pieces.forEach(piece => newPlayer.addPiece(piece.copyPiece()));
        return newPlayer;
    }
}
  
class ChessBoard 
{
    private board: (ChessPiece | null)[][];

    constructor() {
        // Initialise le plateau avec 8 rangées et 8 colonnes, et remplit chaque case avec null
        this.board = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));
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
        if(position === null) return false;
        return !this.isOutOfBounds(position);
    }

    // Déplace une pièce d'une position à une autre
    movePiece(from: string, to: string) {
        const piece = this.getPieceAt(from);
        if (!piece) {
            throw new Error("No piece at the specified position " + from + " to " + to);
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

class ChessGame
{    
    private board: ChessBoard; // le plateau de jeu
    private whitePlayer: Player; // le joueur blanc
    private blackPlayer: Player; // le joueur noir
    private currentTurn: Color; // la couleur du joueur qui doit jouer le prochain tour

    //Utiliser un tableau permet de rendre le code plus flexible et adaptable à des modifications éventuelles.
    //Cela pourrait être utile dans le cas où la logique du jeu est modifiée pour autoriser plus d'un pion à effectuer un double déplacement, par exemple
    //si on implemente un jeu d'echecs a 4 joueurs
    private pawnsWithDoubleMove: Pawn[] = []; // les pions qui ont fait un double déplacement au tour précédent pour pouvoir les capturer en passant

    private QueenSideCastlingWhite: boolean = true; // le roque à gauche est-il possible pour le joeur blanc ?
    private KingSideCastlingWhite: boolean = true; // le roque à droite est-il possible pour le joeur blanc ?
    private QueenSideCastlingBlack: boolean = true; // le roque à gauche est-il possible pour le joueur noir ?
    private KingSideCastlingBlack: boolean = true; // le roque à droite est-il possible pour le joueur noir ?
  
    constructor() {
        this.board = new ChessBoard();
        this.whitePlayer = new Player(Color.White);
        this.blackPlayer = new Player(Color.Black);
        this.currentTurn = Color.White;
        this.initializePieces();
    }

    // Initialise le plateau de jeu avec les pièces aux positions initiales
    //A REVOIR en plus propre
    private initializePieces() {
        const pieceClasses = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
        const positions = [
          "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
          "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
        ];
    
         // Initialize the pieces for each player
        for (let i = 0; i < positions.length; i++) {
          const position = positions[i];
          const [file, rank] = position.split("");
          const color = rank < "3" ? Color.White : Color.Black;
          const PieceClass = pieceClasses[i % 8];
          const piece = new PieceClass(color, position);
          if (color === Color.White) {
            this.whitePlayer.addPiece(piece);
          } else {
            this.blackPlayer.addPiece(piece);
          }
          this.board.setPieceAt(position, piece);
        }

        // Initialize the pawns for each player
        for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
            const whitePawnPosition = String.fromCharCode(97 + fileIndex) + "2";
            const blackPawnPosition = String.fromCharCode(97 + fileIndex) + "7";
            const whitePawn = new Pawn(Color.White, whitePawnPosition);
            const blackPawn = new Pawn(Color.Black, blackPawnPosition);
            this.whitePlayer.addPiece(whitePawn);
            this.blackPlayer.addPiece(blackPawn);
            this.board.setPieceAt(whitePawnPosition, whitePawn);
            this.board.setPieceAt(blackPawnPosition, blackPawn);
        }
    }

    public makeMove(from: string, to: string) {
        const fromPiece = this.board.getPieceAt(from);
        if (!fromPiece) {
            throw new Error("No piece at the specified position");
        }
        if (fromPiece.color !== this.currentTurn) {
            throw new Error("It is not your turn");
        }
        const toPiece = this.board.getPieceAt(to);
        if (toPiece && toPiece.color === fromPiece.color) {
            throw new Error("Cannot capture your own piece");
        }
        if (!fromPiece.isValidMove(to, this)) {
            throw new Error("Invalid move for this piece");
        }
       
        //Verfier si on est encore en échec après le déplacement
        const copygame = this.CopyGame();
        const king = this.currentTurn === Color.White ? copygame.board.getWhiteKing() : copygame.board.getBlackKing();
        copygame.board.movePiece(from, to);
        if (king.isKingInCheck(king.position,copygame)) {
            throw new Error("Cannot move in check");
        }

        //Si on mange une pièce, on la retire du joueur adverse
        if (toPiece) {
            if (toPiece.color === Color.White) {
                this.whitePlayer.removePiece(toPiece);
            } else {
                this.blackPlayer.removePiece(toPiece);
            }
        }
        

        // Réinitialiser les pions qui ont effectué un double pas au tour précédent
        this.pawnsWithDoubleMove.forEach((pawn) => {
            pawn.resetDoubleMove();
        });
        this.pawnsWithDoubleMove = [];

        this.board.movePiece(from, to);

        if(this.isCheckmate()) {
            throw new Error("Checkmate Winner: " + this.currentTurn);
        }
        if(this.isStalemate()) {
            throw new Error("Stalemate");
        }

        // Si le pion a fait un double pas, on l'ajoute à la liste des pions pouvant être capturés en passant
        if (fromPiece instanceof Pawn && Math.abs(fromPiece.position.charCodeAt(1) - to.charCodeAt(1)) === 2) {
            this.pawnsWithDoubleMove.push(fromPiece);
        }

        // Si le pion est sur la dernière rangée, on le transforme en reine
        if (fromPiece instanceof Pawn && (to[1] === "1" || to[1] === "8")) {
            const queen = new Queen(fromPiece.color, to);
            this.board.setPieceAt(to, queen);
            if (fromPiece.color === Color.White) {
                this.whitePlayer.addPiece(queen);
                this.whitePlayer.removePiece(fromPiece);
            } else {
                this.blackPlayer.addPiece(queen);
                this.blackPlayer.removePiece(fromPiece);
            }
        }

        //Si le roi a bougé, on ne peut plus faire de roque
        if (fromPiece instanceof King) {
            if (fromPiece.color === Color.White) {
                this.KingSideCastlingWhite = false;
                this.QueenSideCastlingWhite = false;
            } else {
                this.KingSideCastlingBlack = false;
                this.QueenSideCastlingBlack = false;
            }
        }

        //Si la tour a bougé, on ne peut plus faire de roque
        if (fromPiece instanceof Rook) {
            if (fromPiece.color === Color.White) {
                if (fromPiece.position === "a1") {
                    this.QueenSideCastlingWhite = false;
                } else if (fromPiece.position === "h1") {
                    this.KingSideCastlingWhite = false;
                }
            } else {
                if (fromPiece.position === "a8") {
                    this.QueenSideCastlingBlack = false;
                } else if (fromPiece.position === "h8") {
                    this.KingSideCastlingBlack = false;
                }
            }
        }

        //Si le roi blanc a fait un petit roque, on déplace la tour
        if (fromPiece instanceof King && fromPiece.position === "e1" && to === "g1") {
            const rook = this.board.getPieceAt("h1");
            if (rook) {
                this.board.movePiece("h1", "f1");
            }
        }

        //Si le roi blanc a fait un grand roque, on déplace la tour
        if (fromPiece instanceof King && fromPiece.position === "e1" && to === "c1") {
            const rook = this.board.getPieceAt("a1");
            if (rook) {
                this.board.movePiece("a1", "d1");
            }
        }

        //Si le roi noir a fait un petit roque, on déplace la tour
        if (fromPiece instanceof King && fromPiece.position === "e8" && to === "g8") {
            const rook = this.board.getPieceAt("h8");
            if (rook) {
                this.board.movePiece("h8", "f8");
            }
        }

        //Si le roi noir a fait un grand roque, on déplace la tour
        if (fromPiece instanceof King && fromPiece.position === "e8" && to === "c8") {
            const rook = this.board.getPieceAt("a8");
            if (rook) {
                this.board.movePiece("a8", "d8");
            }
        }
        
        this.currentTurn = this.currentTurn === Color.White ? Color.Black : Color.White;
    }

    public getBoard(): ChessBoard {
        return this.board;
    }

    public canRoqueKingSide(color: Color): boolean {
        return color === Color.White ? this.KingSideCastlingWhite : this.KingSideCastlingBlack;
    }

    public canRoqueQueenSide(color: Color): boolean {
        return color === Color.White ? this.QueenSideCastlingWhite : this.QueenSideCastlingBlack;
    }

    public addPawnWithDoubleMove(pawn: Pawn) {
        this.pawnsWithDoubleMove.push(pawn);
    }

    public getCurrentTurn(): Color {
        return this.currentTurn;
    }

    public getPlayer(color: Color): Player {
        return color === Color.White ? this.whitePlayer : this.blackPlayer;
    }

    public getLegalMovesForPieceAt(position: string): string[] {
        const piece = this.board.getPieceAt(position);
        if (!piece) {
            throw new Error("No piece at the specified position");
        }
    
        const legalMoves = piece.getLegalMoves(this);
        const newLegalMoves : string[] = [];
    
        //parcourir les mouvements légaux et vérifier si on est encore en échec après le déplacement
        legalMoves.forEach((move) => {
            const copyGame = this.CopyGame();
            copyGame.board.movePiece(position, move);
            const king = piece.color === Color.White ? copyGame.board.getWhiteKing() : copyGame.board.getBlackKing();
            if (!king.isKingInCheck(king.position, copyGame)) {
                newLegalMoves.push(move);
            }
        });
    
        return newLegalMoves;
    }

    public getLegalMovesForPlayer(player: Player): string[] {
        const legalMoves: string[] = [];
        player.getPieces().forEach((piece) => {
            const pieceLegalMoves = this.getLegalMovesForPieceAt(piece.position);
            pieceLegalMoves.forEach((move) => {
                legalMoves.push(piece.position + move);
            });
        });
        return legalMoves;
    }

    public isCheckmate(): boolean {
        // Vérifier si l'un des rois est en échec et mat
        if(this.whitePlayer.getKing().isKingInCheck(this.whitePlayer.getKing().position, this) && this.getLegalMovesForPlayer(this.whitePlayer).length === 0) {
            return true;
        }
        if(this.blackPlayer.getKing().isKingInCheck(this.blackPlayer.getKing().position, this) && this.getLegalMovesForPlayer(this.blackPlayer).length === 0) {
            return true;
        }
        return false;
    }

    public isStalemate(): boolean {
        // Vérifier si l'un des joueurs est en pat
        if(!this.whitePlayer.getKing().isKingInCheck(this.whitePlayer.getKing().position, this) && this.getLegalMovesForPlayer(this.whitePlayer).length === 0) {
            return true;
        }
        if(!this.blackPlayer.getKing().isKingInCheck(this.blackPlayer.getKing().position, this) && this.getLegalMovesForPlayer(this.blackPlayer).length === 0) {
            return true;
        }
        return false;
    }

    public CopyGame(): ChessGame {
        const clone = new ChessGame();
        clone.board = this.board.copyBoard();
        clone.whitePlayer = this.whitePlayer.copyPlayer();
        clone.blackPlayer = this.blackPlayer.copyPlayer();
        clone.currentTurn = this.currentTurn;
        clone.pawnsWithDoubleMove = this.pawnsWithDoubleMove.map((pawn) => pawn.copyPiece() as Pawn);
        return clone;
    }
    
}

export default ChessGame;