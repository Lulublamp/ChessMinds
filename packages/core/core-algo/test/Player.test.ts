import { Player } from "../src/factory";
import { ChessPiece, Color, King, Pawn } from "../src/pieces";

describe("Player", () => {
  let player: Player;
  let king: King;
  let pawn: ChessPiece;

  beforeEach(() => {
    player = new Player(Color.White);
    king = new King(Color.White, "e1");
    pawn = new Pawn(Color.White, "a2");
  });

  describe("constructor", () => {
    test("creates a player object with the specified color", () => {
      expect(player.color).toBe(Color.White);
    });

    test("creates a player object with an empty piece collection", () => {
      expect(player.pieces.length).toBe(0);
    });
  });

  describe("addPiece", () => {
    test("adds a piece to the player's collection", () => {
      player.addPiece(king);
      expect(player.pieces.length).toBe(1);
      expect(player.pieces[0]).toEqual(king);
    });
  });

  describe("removePiece", () => {
    test("removes a piece from the player's collection", () => {
      player.addPiece(king);
      player.addPiece(pawn);
      player.removePiece(king);
      expect(player.pieces.length).toBe(1);
      expect(player.pieces[0]).toEqual(pawn);
    });

    test("does not remove a piece that is not in the player's collection", () => {
      player.addPiece(pawn);
      const invalidPiece = new Pawn(Color.Black, "e7");
      player.removePiece(invalidPiece);
      expect(player.pieces.length).toBe(1);
      expect(player.pieces[0]).toEqual(pawn);
    });
  });

  describe("getPieces", () => {
    test("returns a copy of the player's piece collection", () => {
      player.addPiece(king);
      player.addPiece(pawn);
      const pieces = player.getPieces();
      expect(pieces).toEqual(player.pieces);
      expect(pieces).not.toBe(player.pieces);
    });
  });

  describe("getKing", () => {
    test("returns the player's king piece", () => {
      player.addPiece(king);
      player.addPiece(pawn);
      expect(player.getKing()).toEqual(king);
    });

    test("returns null if the player does not have a king", () => {
      player.addPiece(pawn);
      expect(player.getKing()).toBeUndefined();
    });
  });

  describe("copyPlayer", () => {
    test("returns a deep copy of the player object", () => {
      player.addPiece(king);
      player.addPiece(pawn);
      const copiedPlayer = player.copyPlayer();
      expect(copiedPlayer).toEqual(player);
      expect(copiedPlayer).not.toBe(player);
      expect(copiedPlayer.pieces).not.toBe(player.pieces);
      expect(copiedPlayer.pieces[0]).toEqual(player.pieces[0]);
      expect(copiedPlayer.pieces[0]).not.toBe(player.pieces[0]);
      expect(copiedPlayer.pieces[1]).toEqual(player.pieces[1]);
      expect(copiedPlayer.pieces[1]).not.toBe(player.pieces[1]);
    });
  });
});
