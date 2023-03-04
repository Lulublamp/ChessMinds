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

    if (this.isCheckmate()) {
      throw new Error("Checkmate Winner: " + this.currentTurn);
    }
    if (this.isStalemate()) {
      throw new Error("Stalemate");
    }

    // Si le pion a fait un double pas, on l'ajoute à la liste des pions pouvant être capturés en passant
    if (
      fromPiece instanceof Pawn &&
      Math.abs(fromPiece.position.charCodeAt(1) - to.charCodeAt(1)) === 2
    ) {
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
    if (
      fromPiece instanceof King &&
      fromPiece.position === "e1" &&
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
      fromPiece.position === "e1" &&
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
      fromPiece.position === "e8" &&
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
      fromPiece.position === "e8" &&
      to === "c8"
    ) {
      const rook = this.board.getPieceAt("a8");
      if (rook) {
        this.board.movePiece("a8", "d8");
      }
    }

    this.currentTurn =
      this.currentTurn === Color.White ? Color.Black : Color.White;
  }

  public getBoard(): ChessBoard {
    return this.board;
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
    return clone;
  }
}