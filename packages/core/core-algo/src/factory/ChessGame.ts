import { Player } from "./Player";
import { Color } from "../pieces/ChessPiece";
import { Pawn } from "../pieces/Pawn";
import { Bishop } from "../pieces/Bishop";
import { King } from "../pieces/King";
import { Knight } from "../pieces/Knight";
import { Queen } from "../pieces/Queen";
import { Rook } from "../pieces/Rook";
import { ChessBoard } from "./ChessBoard";

export class ChessGame {
  private board: ChessBoard; // le plateau de jeu
  private previousGame: ChessGame | null; // etat partie précédente
  private whitePlayer: Player; // le joueur blanc
  private blackPlayer: Player; // le joueur noir
  private currentTurn: Color; // la couleur du joueur qui doit jouer le prochain tour
  private sameMoves: number; // le nombre de coups identiques joués
  private drawRequested: boolean; // le joueur a-t-il demandé un match nul ?

  //Utiliser un tableau permet de rendre le code plus flexible et adaptable à des modifications éventuelles.
  //Cela pourrait être utile dans le cas où la logique du jeu est modifiée pour autoriser plus d'un pion à effectuer un double déplacement, par exemple
  //si on implemente un jeu d'echecs a 4 joueurs
  private pawnsWithDoubleMove: Pawn[] = []; // les pions qui ont fait un double déplacement au tour précédent pour pouvoir les capturer en passant

  private QueenSideCastlingWhite: boolean = true; // le roque à gauche est-il possible pour le joeur blanc ?
  private KingSideCastlingWhite: boolean = true; // le roque à droite est-il possible pour le joeur blanc ?
  private QueenSideCastlingBlack: boolean = true; // le roque à gauche est-il possible pour le joueur noir ?
  private KingSideCastlingBlack: boolean = true; // le roque à droite est-il possible pour le joueur noir ?
  private movesHistory: Array<{ from: string, to: string, piece: string, color: Color }> = [];

  constructor() {
    this.board = new ChessBoard();
    this.whitePlayer = new Player(Color.White);
    this.blackPlayer = new Player(Color.Black);
    this.previousGame = null;
    this.currentTurn = Color.White;
    this.initializePieces();
    this.sameMoves = 0;
    this.drawRequested = false;
  }

  public vierge() {
    this.board = new ChessBoard();
    this.whitePlayer = new Player(Color.White);
    this.blackPlayer = new Player(Color.Black);
    this.currentTurn = Color.White;
  }

  // Initialise le plateau de jeu avec les pièces aux positions initiales
  //A REVOIR en plus propre
  private initializePieces() {
    const pieceClasses = [
      Rook,
      Knight,
      Bishop,
      Queen,
      King,
      Bishop,
      Knight,
      Rook,
    ];
    const positions = [
      "a1",
      "b1",
      "c1",
      "d1",
      "e1",
      "f1",
      "g1",
      "h1",
      "a8",
      "b8",
      "c8",
      "d8",
      "e8",
      "f8",
      "g8",
      "h8",
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

  public makeMove(from: string, to: string, promotion?: string) {
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
    //Si les 2 joueurs ont fait 3 fois le même coup, c'est un pat
    if(from === this.movesHistory[this.movesHistory.length - 2]?.to && to === this.movesHistory[this.movesHistory.length - 2]?.from) {
      this.sameMoves++;
      console.log(this.sameMoves);
    }
    else {
      this.sameMoves = 0;
    }
    if(this.sameMoves === 4) {
      return {
        status: 'stalemate',
        message: 'Stalemate',
        winner : 0.5
      };
    }

    //Stocker la partie précédente pour revenir en arrière d'un coup
    const previousGame = this.CopyGame();

    //Verfier si on est encore en échec après le déplacement
    const copygame = this.CopyGame();
    const king =
      this.currentTurn === Color.White
        ? copygame.board.getWhiteKing()
        : copygame.board.getBlackKing();
    copygame.board.movePiece(from, to);
    if (king.isKingInCheck(king.position, copygame)) {
      throw new Error("Cannot move in check");
    }

    //Si on mange une pièce, on la retire du joueur adverse
    if (toPiece) {
      if (toPiece.color === Color.White) {
        const pieceCounter = this.blackPlayer.piecesTaken.get(toPiece.getPieceCode());
        if(pieceCounter !== undefined){
          this.blackPlayer.piecesTaken.set(toPiece.getPieceCode(), pieceCounter + 1);
        }
        this.whitePlayer.removePiece(toPiece);
      } else {
        const pieceCounter = this.whitePlayer.piecesTaken.get(toPiece.getPieceCode());
        if(pieceCounter !== undefined){
          this.whitePlayer.piecesTaken.set(toPiece.getPieceCode(), pieceCounter + 1);
        }
        this.blackPlayer.removePiece(toPiece);
      }
    }
    this.board.movePiece(from, to);
    // Vérifier si c'est une capture en passant si c'est le cas, on supprime la pièce capturée
    if (fromPiece instanceof Pawn && !toPiece && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 1) {
      const direction = fromPiece.color === Color.White ? -1 : 1;
      const lastMovePosition = to[0] + (parseInt(to[1]) + direction);
      const capturedPawn = this.pawnsWithDoubleMove.find(pawn => pawn.position === lastMovePosition);
      if (capturedPawn) {
        this.board.setPieceAt(lastMovePosition, null);
        if (capturedPawn.color === Color.White) {
          this.whitePlayer.removePiece(capturedPawn);
        } else {
          this.blackPlayer.removePiece(capturedPawn);
        }
      }
    }

    // Sauvegardez le coup joué dans movesHistory
    this.movesHistory.push({
      from,
      to,
      piece: fromPiece.constructor.name,
      color: fromPiece.color,
    });

    if (this.isCheckmate()) {
      return {
        status: 'checkmate',
        winner: this.currentTurn,
        message: `Checkmate Winner: ${this.currentTurn}`,
      };
    }
    if (this.isStalemate()) {
      return {
        status: 'stalemate',
        message: 'Stalemate',
        winner : 0.5
      };
    }

    // Réinitialiser les pions qui ont effectué un double pas au tour précédent
    this.pawnsWithDoubleMove.forEach((pawn) => {
      pawn.resetDoubleMove();
    });
    this.pawnsWithDoubleMove = [];

    // Si le pion a fait un double pas, on l'ajoute à la liste des pions pouvant être capturés en passant
    if (
      fromPiece instanceof Pawn &&
      Math.abs(from.charCodeAt(1) - to.charCodeAt(1)) === 2
    ) {
      this.pawnsWithDoubleMove.push(fromPiece);
      fromPiece.setDoubleMove();
    }

    // Si le pion est sur la dernière rangée, on le transforme en la pièce spécifiée
    if (fromPiece instanceof Pawn && (to[1] === "1" || to[1] === "8")) {
      let promotedPiece;
      console.log("promotion", promotion);
      switch (promotion) {
        case "queen":
          promotedPiece = new Queen(fromPiece.color, to);
          break;
        case "rook":
          promotedPiece = new Rook(fromPiece.color, to);
          break;
        case "bishop":
          promotedPiece = new Bishop(fromPiece.color, to);
          break;
        case "knight":
          promotedPiece = new Knight(fromPiece.color, to);
          break;
        default:
          throw new Error("Invalid promotion piece");
      }
      this.board.setPieceAt(to, promotedPiece);
      if (fromPiece.color === Color.White) {
        this.whitePlayer.addPiece(promotedPiece);
        this.whitePlayer.removePiece(fromPiece);
      } else {
        this.blackPlayer.addPiece(promotedPiece);
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
    if (
      fromPiece instanceof King &&
      from === "e1" &&
      to === "g1"
    ) {
      const rook = this.board.getPieceAt("h1");
      if (rook) {
        this.board.movePiece("h1", "f1");
      }
    }

    //Si le roi blanc a fait un grand roque, on déplace la tour
    if (
      fromPiece instanceof King &&
      from === "e1" &&
      to === "c1"
    ) {
      const rook = this.board.getPieceAt("a1");
      if (rook) {
        this.board.movePiece("a1", "d1");
      }
    }

    //Si le roi noir a fait un petit roque, on déplace la tour
    if (
      fromPiece instanceof King &&
      from === "e8" &&
      to === "g8"
    ) {
      const rook = this.board.getPieceAt("h8");
      if (rook) {
        this.board.movePiece("h8", "f8");
      }
    }

    //Si le roi noir a fait un grand roque, on déplace la tour
    if (
      fromPiece instanceof King &&
      from === "e8" &&
      to === "c8"
    ) {
      const rook = this.board.getPieceAt("a8");
      if (rook) {
        this.board.movePiece("a8", "d8");
      }
    }

    this.currentTurn =
      this.currentTurn === Color.White ? Color.Black : Color.White;

    this.previousGame = previousGame;
  }

  public getBoard(): ChessBoard {
    return this.board;
  }

  public setDraw(){
    
  }

  public getMovesHistory(): Array<{ from: string, to: string, piece: string, color: Color }> {
    return this.movesHistory;
  }

  public setBoard(board: ChessBoard) {
    this.board = board;
    this.whitePlayer.resetPieces();
    this.blackPlayer.resetPieces();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.board.getPieceAt(String.fromCharCode(97 + i) + (j + 1));
        if (piece) {
          if (piece.color === Color.White) {
            this.whitePlayer.addPiece(piece);
          } else {
            this.blackPlayer.addPiece(piece);
          }
        }
      }
    }
  }

  public canRoqueKingSide(color: Color): boolean {
    return color === Color.White
      ? this.KingSideCastlingWhite
      : this.KingSideCastlingBlack;
  }

  public canRoqueQueenSide(color: Color): boolean {
    return color === Color.White
      ? this.QueenSideCastlingWhite
      : this.QueenSideCastlingBlack;
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
    const newLegalMoves: string[] = [];
    //parcourir les mouvements légaux et vérifier si on est encore en échec après le déplacement
    legalMoves.forEach((move) => {
      const copyGame = this.CopyGame();
      copyGame.board.movePiece(position, move);
      const king =
        piece.color === Color.White
          ? copyGame.board.getWhiteKing()
          : copyGame.board.getBlackKing();
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
    if (
      this.whitePlayer
        .getKing()
        .isKingInCheck(this.whitePlayer.getKing().position, this) &&
      this.getLegalMovesForPlayer(this.whitePlayer).length === 0
    ) {
      return true;
    }
    if (
      this.blackPlayer
        .getKing()
        .isKingInCheck(this.blackPlayer.getKing().position, this) &&
      this.getLegalMovesForPlayer(this.blackPlayer).length === 0
    ) {
      return true;
    }
    return false;
  }

  public isStalemate(): boolean {
    // Vérifier si l'un des joueurs est en pat
    if (
      !this.whitePlayer
        .getKing()
        .isKingInCheck(this.whitePlayer.getKing().position, this) &&
      this.getLegalMovesForPlayer(this.whitePlayer).length === 0
    ) {
      return true;
    }
    if (
      !this.blackPlayer
        .getKing()
        .isKingInCheck(this.blackPlayer.getKing().position, this) &&
      this.getLegalMovesForPlayer(this.blackPlayer).length === 0
    ) {
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
    clone.pawnsWithDoubleMove = this.pawnsWithDoubleMove.map(
      (pawn) => pawn.copyPiece() as Pawn
    );
    clone.KingSideCastlingWhite = this.KingSideCastlingWhite;
    clone.KingSideCastlingBlack = this.KingSideCastlingBlack;
    clone.QueenSideCastlingWhite = this.QueenSideCastlingWhite;
    clone.QueenSideCastlingBlack = this.QueenSideCastlingBlack;
    return clone;
  }

  public cancelMove(playerColor: string) {
    const realColor = playerColor === 'White' ? Color.White : Color.Black;
    if (this.previousGame === null) {
      throw new Error('No previous game state available to cancel the move.');
      return;
    }
    if (this.currentTurn === realColor) {
      throw new Error('It is not your turn to cancel the move.');
      return;
    }

    this.board = this.previousGame.board;
    this.whitePlayer = this.previousGame.whitePlayer;
    this.blackPlayer = this.previousGame.blackPlayer;
    this.currentTurn = this.previousGame.currentTurn;
    this.pawnsWithDoubleMove = this.previousGame.pawnsWithDoubleMove.map(
      (pawn) => pawn.copyPiece() as Pawn
    );
    this.KingSideCastlingBlack = this.previousGame.KingSideCastlingBlack;
    this.KingSideCastlingWhite = this.previousGame.KingSideCastlingWhite;
    this.QueenSideCastlingBlack = this.previousGame.QueenSideCastlingBlack;
    this.QueenSideCastlingWhite = this.previousGame.QueenSideCastlingWhite;
    this.previousGame = this.previousGame.previousGame;
  }

  public drawRequest() {
    this.drawRequested = true;
  }

  public drawResponse(response: boolean) {
    if(this.drawRequested === false) {
      throw new Error('No draw request to respond to.');
    }
    if (response) {
      // Draw
    }
    else{
      this.drawRequested = false;
    }
  }

  public abandonGame(playerColor: string){
    console.log(playerColor + ' abandonne la partie');
  }

  public getCurrentTurnColor(): string {
    return this.currentTurn === Color.White ? 'White' : 'Black';
  }

  public generateFEN(): string {
    let fen = "";

    // Génère la position des pièces sur l'échiquier
    for (let row = 7; row >= 0; row--) {
      let emptySquares = 0;

      for (let col = 0; col < 8; col++) {
        const piece = this.board.getBoard()[row][col];

        if (piece === null) {
          emptySquares++;
        } else {
          if (emptySquares > 0) {
            fen += emptySquares;
            emptySquares = 0;
          }

          const pieceCode = piece.getPieceCode();
          fen += piece.color === Color.White ? pieceCode.toUpperCase() : pieceCode.toLowerCase();
        }
      }

      if (emptySquares > 0) {
        fen += emptySquares;
      }

      if (row > 0) {
        fen += "/";
      }
    }

    // la couleur du joueur dont c'est le tour
    fen += " " + (this.currentTurn === Color.White ? "w" : "b");

    //les droits de roque
    fen += " ";
    if (this.KingSideCastlingWhite) {
      fen += "K";
    }
    if (this.QueenSideCastlingWhite) {
      fen += "Q";
    }
    if (this.KingSideCastlingBlack) {
      fen += "k";
    }
    if (this.QueenSideCastlingBlack) {
      fen += "q";
    }
    if (!this.KingSideCastlingWhite && !this.QueenSideCastlingWhite && !this.KingSideCastlingBlack && !this.QueenSideCastlingBlack) {
      fen += "-";
    }

    // Ajoute la prise en passant
    fen += " ";
    if (this.pawnsWithDoubleMove.length > 0) {
      const lastPawn = this.pawnsWithDoubleMove[this.pawnsWithDoubleMove.length - 1];
      // La case de prise en passant est juste derrière le pion (selon la couleur du pion)
      const pawnFile = lastPawn.position.charCodeAt(0);
      const pawnRank = parseInt(lastPawn.position.charAt(1));
      const enPassantRank = lastPawn.color === Color.White ? pawnRank - 1 : pawnRank + 1;
      const enPassantSquare = String.fromCharCode(pawnFile) + enPassantRank;
      fen += enPassantSquare;
    } else {
      fen += "-";
    }

    //la demi-règle des 50 coups (à compléter)
    fen += " 0";

    fen += this.movesHistory.length;

    return fen;
  }

  public getWhitePlayerPiecesTaken(): Map<string, number> {
    return this.whitePlayer.piecesTaken;
  }

  public getDifferenceWhitePlayerPiecesTaken(): Map<string, number> {
    let whitePiece = this.getWhitePlayerPiecesTaken();
    let blackPiece = this.getBlackPlayerPiecesTaken();
    let difference = new Map<string, number>();
    for (let [key, value] of whitePiece) {
      difference.set(key, value - (blackPiece.get(key) || 0));
    }
    return difference;
  }

  public getDifferenceBlackPlayerPiecesTaken(): Map<string, number> {
    let whitePiece = this.getWhitePlayerPiecesTaken();
    let blackPiece = this.getBlackPlayerPiecesTaken();
    let difference = new Map<string, number>();
    for (let [key, value] of blackPiece) {
      difference.set(key, value - (whitePiece.get(key) || 0));
    }
    return difference;
  }

  public getBlackPlayerPiecesTaken(): Map<string, number> {
    return this.blackPlayer.piecesTaken;
  }


}