import { ChessBoard, ChessGame } from "../src/factory";
import { ChessPiece, Color } from "../src/pieces";

class MockChessPiece extends ChessPiece {
  constructor(color: Color, position: string) {
    super(color, position);
  }
  public isValidMove(destination: string, game: ChessGame): boolean {
    return true;
  }
  public getLegalMoves(game: ChessGame): string[] {
    return [];
  }

  public isValidDestination(destination: string, board: ChessBoard): boolean {
    return super.isValidDestination(destination, board);
  }

  public isStraightClear(destination: string, board: ChessBoard): boolean {
    return super.isStraightClear(destination, board);
  }

  public isDiagonalClear(destination: string, board: ChessBoard): boolean {
    return super.isDiagonalClear(destination, board);
  }
}

describe("MockChessPiece", () => {
  let game: ChessGame;
  let board: ChessBoard;
  let piece: MockChessPiece;
  
  beforeEach(() => {
    piece = new MockChessPiece(Color.White, "e2");
    board = new ChessBoard();
    board.setPieceAt("e2", piece);
  });

  describe("isValidDestination", () => {
    test("returns true if the destination is on the board", () => {
      expect(piece.isValidDestination("a1", board)).toBe(true);
    });

    test("returns false if the destination is not on the board", () => {
      expect(piece.isValidDestination("i1", board)).toBe(false);
    });
  });

  describe("isStraightClear", () => {
    test("returns true if the path is clear", () => {
      expect(piece.isStraightClear("e4", board)).toBe(true);
    });

    test("returns false if the path is not clear", () => {
      board.setPieceAt("e3", new MockChessPiece(Color.Black, "e3"));
      expect(piece.isStraightClear("e4", board)).toBe(false);
    });
  });

  describe("isDiagonalClear", () => {
    test("returns true if the path is clear", () => {
      expect(piece.isDiagonalClear("g4", board)).toBe(true);
    });

    test("returns false if the path is not clear", () => {
      board.setPieceAt("f3", new MockChessPiece(Color.Black, "f3"));
      expect(piece.isDiagonalClear("g4", board)).toBe(false);
    });
  });

  describe("copyPiece", () => {
    test("returns a copy of the piece", () => {
      const copy = piece.copyPiece();
      expect(copy.color).toBe(piece.color);
      expect(copy.position).toBe(piece.position);
    });
  });
});