import { ChessGame } from "../src/factory";
import { Bishop, ChessPiece, Color, King, Pawn } from "../src/pieces";




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
    test("returns true for a legal diagonal move", () => {
      expect(bishop.isValidMove("g5", vGame)).toBe(true);
    });

    test("returns false for a move that is not diagonal", () => {
      expect(bishop.isValidMove("e3", game)).toBe(false);
    });

    test("returns false for a move that is not clear", () => {
      game.makeMove("d2", "d4");
      expect(bishop.isValidMove("b2", game)).toBe(false);
      expect(bishop.isValidMove("d2", game)).toBe(true);
    });

    test("returns false for a move that is not on the board", () => {
      expect(bishop.isValidMove("h9", game)).toBe(false);
    });
  });

  describe("getLegalMoves", () => {
    test("returns the correct list of legal moves", () => {
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

    test("returns an empty list if the bishop has no legal moves", () => {
      const legalMoves = bishop.getLegalMoves(game);
      expect(legalMoves.length).toBe(0);
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
//     pawn = new Pawn(Color.Black, "a7");
//     game.getBoard().setPieceAt("e1", king);
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
