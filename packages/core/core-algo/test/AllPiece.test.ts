import { ChessBoard, ChessGame } from "../src/factory";
import { Bishop, ChessPiece, Color, King, Knight, Pawn } from "../src/pieces";




/*
Un déplacement diagonal légal
Un déplacement non diagonal
Un déplacement obstrué
Un déplacement en dehors du plateau
Une liste de mouvements légaux correcte
Une liste de mouvements légaux vide si le fou n'a pas de mouvements légaux.
*/
describe("Bishop", () => {
  let game: ChessGame;
  let vGame: ChessGame;
  let bishop: Bishop;

  beforeEach(() => {
    game = new ChessGame();
    vGame = new ChessGame();
    vGame.vierge();
    bishop = new Bishop(Color.White, "c1");
  });

  describe("isValidMove", () => {
    test("T1 retourne vrai pour un déplacement diagonal légal", () => {
      expect(bishop.isValidMove("g5", vGame)).toBe(true);
    });

    test("T2 retourne faux pour un déplacement qui n'est pas diagonal", () => {
      expect(bishop.isValidMove("e3", game)).toBe(false);
    });

    test("T3 retourne faux pour un déplacement qui n'est pas dégagé", () => {
      game.makeMove("d2", "d4");
      expect(bishop.isValidMove("b2", game)).toBe(false);
      expect(bishop.isValidMove("d2", game)).toBe(true);
    });

    test("T4 retourne faux pour un déplacement qui n'est pas sur le plateau", () => {
      expect(bishop.isValidMove("h9", game)).toBe(false);
    });
  });

  describe("getLegalMoves", () => {
    test("T1 retourne la liste correcte de déplacements légaux", () => {
      const legalMoves = bishop.getLegalMoves(vGame);
      expect(legalMoves).toContain("d2");
      expect(legalMoves).toContain("b2");
      expect(legalMoves).toContain("a3");
      expect(legalMoves).toContain("e3");
      expect(legalMoves).toContain("f4");
      expect(legalMoves).toContain("g5");
      expect(legalMoves).toContain("h6");
      expect(legalMoves.length).toBe(7);
    });

    test("T2 retourne une liste vide si le fou n'a pas de coups légaux", () => {
      const legalMoves = bishop.getLegalMoves(game);
      expect(legalMoves.length).toBe(0);
    });
  });
});

describe("Pawn", () => {
  let game: ChessGame;
  let board: ChessBoard;
  let pawn: Pawn;

  beforeEach(() => {
    game = new ChessGame();
    board = game.getBoard();
    pawn = board.getPieceAt("a2") as Pawn;
  });

  describe("isValidMove", () => {
    test("T1 retourne vrai si le pion avance d'une case", () => {
      expect(pawn.isValidMove("a3", game)).toBe(true);
    });

    test("T2 retourne vrai si le pion avance de deux cases depuis sa position de départ", () => {
      expect(pawn.isValidMove("a4", game)).toBe(true);
    });

    test("T3 retourne faux si le pion avance de deux cases depuis une position qui n'est pas celle de départ", () => {
      board.setPieceAt("a3", new Pawn(Color.White , "a3"));
      expect(pawn.isValidMove("a4", game)).toBe(false);
    });

    test("T4 retourne faux si le pion recule", () => {
      expect(pawn.isValidMove("a1", game)).toBe(false);
    });

    test("T5 retourne vrai si le pion se déplace en diagonale pour capturer une pièce ennemie", () => {
      board.setPieceAt("b3", new Pawn(Color.Black , "b3"));
      expect(pawn.isValidMove("b3", game)).toBe(true);
    });

    test("T6 retourne faux si le pion se déplace en diagonale sans capturer une pièce ennemie", () => {
      expect(pawn.isValidMove("b3", game)).toBe(false);
    });

    test("T7 retourne vrai si le pion effectue une prise en passant", () => {
      game.makeMove("a2", "a4");
      game.makeMove("h7" , "h5");
      game.makeMove("a4", "a5");
      game.makeMove("b7", "b5");
      const whitePawn = board.getPieceAt("a5") as Pawn;
      expect(whitePawn.isValidMove("b6", game)).toBe(true);
      game.makeMove("a5", "b6");
      expect(board.getPieceAt("b5")).toBeNull();
    });

    test("T8 retourne faux si le pion essaie de faire une prise en passant mais que les conditions ne sont pas remplies", () => {
      game.makeMove("a2", "a4");
      game.makeMove("b7" , "b6");
      game.makeMove("a4", "a5");
      game.makeMove("b6", "b5");
      const whitePawn = board.getPieceAt("a5") as Pawn;
      expect(whitePawn.isValidMove("b6", game)).toBe(false);
      expect(() => {
        game.makeMove("a5", "b6");
      }).toThrow
    });
  });

  describe("resetDoubleMove", () => {
    test("T1 réinitialise le flag doubleMove à faux", () => {
      pawn.resetDoubleMove();
      expect(pawn['doubleMove']).toBe(false);
    });
  });

  describe("getLegalMoves", () => {
    test("T1 retourne un tableau contenant une case en avant si elle est dégagée", () => {
      const newPawn = new Pawn(Color.White , "a3");
      board.setPieceAt("a3", newPawn);
      expect(newPawn.getLegalMoves(game)).toEqual(["a4"]);
    });

    test("T2 retourne un tableau contenant deux cases en avant si elles sont dégagées et si le pion est sur sa position de départ", () => {
      expect(pawn.getLegalMoves(game)).toEqual(["a3", "a4"]);
    });

    test("T3 ne doit pas retourner deux cases en avant si elles sont obstruées", () => {
      board.setPieceAt("a3", new Pawn(Color.White , "a3"));
      expect(pawn.getLegalMoves(game)).toEqual([]);
    });

    test("T4 retourne un tableau contenant les cases diagonales vers l'avant si elles contiennent des pièces ennemies", () => {
      board.setPieceAt("b3", new Pawn(Color.Black , "b3"));
      expect(pawn.getLegalMoves(game)).toContain("b3");
    });
  });
});


describe("Knight", () => {
  let game: ChessGame;
  let knight: Knight;

  beforeEach(() => {
    game = new ChessGame();
    knight = game.getBoard().getPieceAt("b1") as Knight;
  });

  describe("isValidMove", () => {
    test("T1 retourne vrai pour un déplacement légal", () => {
      expect(knight.isValidMove("a3", game)).toBe(true);
    });

    test("T2 retourne faux pour un déplacement hors du plateau", () => {
      expect(knight.isValidMove("i10", game)).toBe(false);
    });

    test("T3 retourne faux pour un déplacement qui n'est pas en L", () => {
      expect(knight.isValidMove("a2", game)).toBe(false);
    });

    test("T4 retourne faux pour un déplacement vers une case occupée par une pièce de la même couleur", () => {
      game.makeMove("b1", "a3");
      game.makeMove("a7", "a5");
      expect(knight.isValidMove("a3", game)).toBe(false);
      expect(() => {
        game.makeMove("b1", "a3");
      }).toThrow();
    });

    test("T5 retourne vrai pour un déplacement vers une case occupée par une pièce de couleur différente", () => {
      game.makeMove("b1", "a3");
      game.makeMove("a7", "a6");
      expect(knight.isValidMove("c2", game)).toBe(false);
      expect(
        () => {
          game.makeMove("a3", "c2");
        }
      )
    });
  });

  describe("getLegalMoves", () => {
    test("T1 retourne la liste correcte de déplacements légaux", () => {
      game.makeMove("d2", "d4");
      const legalMoves = knight.getLegalMoves(game);
      expect(legalMoves).toContain("a3");
      expect(legalMoves).toContain("c3");
      expect(legalMoves).toContain("d2");
      expect(legalMoves.length).toBe(3);
    });

    test("T2 retourne une liste vide si le cavalier n'a pas de coups légaux", () => {
      game.makeMove("c2", "c3");
      game.makeMove("c7", "c5");
      game.makeMove("a2", "a3");
      expect(knight.getLegalMoves(game)).toEqual([]);
    });
  });
});

// describe("King", () => {
//   let game: ChessGame;
//   let king: King;
//   let pawn: ChessPiece;

//   beforeEach(() => {
//     game = new ChessGame();
//     king = new King(Color.White, "e1");
//     pawn = new Pawn("a7");
//   , Color.Black   game.getBoard().setPieceAt("e1", king);
//     game.getBoard().setPieceAt("a7", pawn);
//   });

//   describe("isValidMove", () => {
//     test("returns true for a valid move", () => {
//       const isValid = king.isValidMove("f2", game);
//       expect(isValid).toBe(true);
//     });

//     test("returns false for an invalid move", () => {
//       const isValid = king.isValidMove("a7", game);
//       expect(isValid).toBe(false);
//     });

//     test("returns false if the move would result in the king being in check", () => {
//       game.getBoard().setPieceAt("g2", new Pawn(Color.Black, "g2"));
//       const isValid = king.isValidMove("f2", game);
//       expect(isValid).toBe(false);
//     });

//     test("returns true for a valid king-side castle move", () => {
//       game.getBoard().setPieceAt("f1", new Pawn(Color.White, "f1"));
//       const isValid = king.isValidMove("g1", game);
//       expect(isValid).toBe(true);
//     });

//     test("returns false for an invalid king-side castle move", () => {
//       game.getBoard().setPieceAt("f1", new Pawn(Color.White, "f1"));
//       const isValid = king.isValidMove("h1", game);
//       expect(isValid).toBe(false);
//     });

//     test("returns true for a valid queen-side castle move", () => {
//       game.getBoard().setPieceAt("d1", new Pawn(Color.White, "d1"));
//       const isValid = king.isValidMove("c1", game);
//       expect(isValid).toBe(true);
//     });

//     test("returns false for an invalid queen-side castle move", () => {
//       game.getBoard().setPieceAt("d1", new Pawn(Color.White, "d1"));
//       const isValid = king.isValidMove("a1", game);
//       expect(isValid).toBe(false);
//     });
//   });

//   describe("isKingInCheck", () => {
//     test("returns true if the king is in check", () => {
//       game.getBoard().setPieceAt("h2", new Pawn(Color.Black, "h2"));
//       const isCheck = king.isKingInCheck("f2", game);
//       expect(isCheck).toBe(true);
//     });

//     test("returns false if the king is not in check", () => {
//       const isCheck = king.isKingInCheck("f2", game);
//       expect(isCheck).toBe(false);
//     });
//   });

//   describe("getLegalMoves", () => {
//     test("returns the correct list of legal moves", () => {
//       const legalMoves = king.getLegalMoves(game);
//       expect(legalMoves).toContain("f2");
//       expect(legalMoves).toContain("d2");
//       expect(legalMoves).toContain("d1");
//       expect(legalMoves.length).toBe(3);
//     });

//     test("returns an empty list if the king is in check and has no legal moves", () => {
//       game.getBoard().setPieceAt("h2", new Pawn(Color.Black, "h2"));
//       const legalMoves = king.getLegalMoves(game);
//       expect(legalMoves.length).toBe(0);
//     });
//   });
// });
