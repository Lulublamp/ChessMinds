import { ChessBoard } from "../src/factory";
import { King, Color, Pawn } from "../src/pieces";

describe("ChessBoard", () => {
  let board: ChessBoard;

  beforeEach(() => {
    board = new ChessBoard();
  });

  describe("Constructor", () => {
    test("creates an empty 8x8 board", () => {
      const internalBoard = board.getBoard();
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          expect(internalBoard[row][col]).toBeNull();
        }
      }
    });
  });

  describe("getPieceAt()", () => {
    test("returns null for empty square", () => {
      expect(board.getPieceAt("a1")).toBeNull();
    });

    test("returns the correct piece for various positions", () => {
      const whiteKing = new King(Color.White, "e1");
      const blackKing = new King(Color.Black, "e8");
      board.setPieceAt("e1", whiteKing);
      board.setPieceAt("e8", blackKing);

      expect(board.getPieceAt("e1")).toEqual(whiteKing);
      expect(board.getPieceAt("e8")).toEqual(blackKing);
      expect(board.getPieceAt("a3")).toBeNull();
      expect(board.getPieceAt("h5")).toBeNull();
    });
  });

  describe("setPieceAt()", () => {
    test("places various pieces at specified positions", () => {
      const whiteKing = new King(Color.White, "e1");
      const blackKing = new King(Color.Black, "e8");
      board.setPieceAt("e1", whiteKing);
      board.setPieceAt("e8", blackKing);
      expect(board.getPieceAt("e1")).toEqual(whiteKing);
      expect(board.getPieceAt("e8")).toEqual(blackKing);
    });
  });

  describe("isOutOfBounds()", () => {
    test("returns true for out of bounds position", () => {
      expect(board.isOutOfBounds("i1")).toBe(true);
      expect(board.isOutOfBounds("a9")).toBe(true);
      expect(board.isOutOfBounds("a0")).toBe(true);
    });

    test("returns false for valid position", () => {
      expect(board.isOutOfBounds("h8")).toBe(false);
      expect(board.isOutOfBounds("a1")).toBe(false);
    });
  });

  describe("isValidSquare()", () => {
    test("returns true for valid position", () => {
      expect(board.isValidSquare("a1")).toBe(true);
      expect(board.isValidSquare("h8")).toBe(true);
    });

    test("returns false for invalid position", () => {
      expect(board.isValidSquare("i1")).toBe(false);
      expect(board.isValidSquare("a0")).toBe(false);
    });
  });

  describe("movePiece()", () => {
    test("moves a piece from one position to another", () => {
      const king = new King(Color.White, "e1");
      board.setPieceAt("e1", king);
      board.movePiece("e1", "e2");
      expect(board.getPieceAt("e1")).toBeNull();
      expect(board.getPieceAt("e2")).toEqual(king);
    });

    test("does not move a non-existent piece", () => {
      
      expect(() => {
        board.movePiece("a1", "a2");
      }).toThrow();

      expect(board.getPieceAt("a1")).toBeNull();
      expect(board.getPieceAt("a2")).toBeNull();
    });

    test("captures an opposing piece", () => {
      const whiteKing = new King(Color.White, "e1");
      const blackKing = new King(Color.Black, "e8");
      board.setPieceAt("e1", whiteKing);
      board.setPieceAt("e8", blackKing);

      board.movePiece("e1", "e8"); // Capturer le roi noir
      expect(board.getPieceAt("e1")).toBeNull();
      expect(board.getPieceAt("e8")).toEqual(whiteKing);
    });
  });

  describe("getBlackKing()", () => {
    test("finds the black king on the board", () => {
      const blackKing = new King(Color.Black, "e8");
      board.setPieceAt("e8", blackKing);
      expect(board.getBlackKing()).toEqual(blackKing);
    });
    test("returns null if black king is not on the board", () => {
      expect(() => {
        board.getBlackKing();
      }).toThrow();
    });
  });

  describe("getWhiteKing()", () => {
    test("finds the white king on the board", () => {
      const whiteKing = new King(Color.White, "e1");
      board.setPieceAt("e1", whiteKing);
      expect(board.getWhiteKing()).toEqual(whiteKing);
    });
    test("returns null if white king is not on the board", () => {
      expect(() => {
        board.getWhiteKing();
      }).toThrow();
    });
  });

  describe("copyBoard()", () => {
    test("creates a deep copy of the board", () => {
      const king = new King(Color.White, "e1");
      board.setPieceAt("e1", king);
      const copiedBoard = board.copyBoard();
      const internalBoard = board.getBoard();
      const copiedInternalBoard = copiedBoard.getBoard();
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (internalBoard[row][col]) {
            expect(copiedInternalBoard[row][col]).not.toBe(internalBoard[row][col]);
            expect(copiedInternalBoard[row][col]).toEqual(internalBoard[row][col]);
          } else {
            expect(copiedInternalBoard[row][col]).toBeNull();
          }
        }
      }
    });

    test("creates an independent copy of the board", () => {
      const pawn1 = new Pawn(Color.White, "e1");
      const pawn2 = new Pawn(Color.White, "e1");

      board.setPieceAt("e1", pawn1);
      const copiedBoard = board.copyBoard();

      board.movePiece("e1", "e2");
      expect(copiedBoard.getPieceAt("e1")).toEqual(pawn2);
      expect(copiedBoard.getPieceAt("e2")).toBeNull();
    });

    test("keeps the same pieces on the copied board", () => {
      const whiteKing = new King(Color.White, "e1");
      const blackKing = new King(Color.Black, "e8");
      board.setPieceAt("e1", whiteKing);
      board.setPieceAt("e8", blackKing);
      const copiedBoard = board.copyBoard();

      expect(copiedBoard.getPieceAt("e1")).toEqual(whiteKing);
      expect(copiedBoard.getPieceAt("e8")).toEqual(blackKing);
    });
  });
});