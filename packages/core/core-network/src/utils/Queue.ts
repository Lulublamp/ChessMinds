import { Socket } from "socket.io";
import { ChessGame, Color, Player } from "../../../core-algo";
import { lobbyPlayer, MMPlayer } from "../interfaces/emitEvents";
import { JoinQueuOption } from "../MatchMaking";
import { MATCHMAKING_MODE } from "../Namespace";

export interface PPlayer {
  socket: string;
  id: string;
  name: string;
  elo: number;
  rank?: number | null;
  player?: Player;
}

export const MatchState = {
  waiting: "waiting",
  playing: "playing",
  ended: "ended",
} as const;

export type MatchState = (typeof MatchState)[keyof typeof MatchState];

export interface Match<T> {
  matchId: string;
  players: (T extends PPlayer ? PPlayer : lobbyPlayer)[];
  createdAt: Date;
  endedAt: Date | null;
  winner: PPlayer | null;
  state: MatchState;
  currentTurn: T extends PPlayer ? PPlayer : lobbyPlayer;
}

export interface IGame {
  matchId: string;
  matchOptions: JoinQueuOption;
  white_player: MMPlayer;
  black_player: MMPlayer;
  createdAt: Date;
  winnder: string;
}

export class Queue {
  protected games: IGame[] = [];  
  protected queue: MMPlayer[] = [];
  protected coupledGames: Map<string , ChessGame> = new Map<string , ChessGame>();
  protected socketMap: Map<string, string>;

  get gamesList(): IGame[] {
    return this.games;
  }

  public mutateGameSocketId(matchId: string , socketId: string , name: string) {
    const game = this.games.find(game => game.matchId === matchId)
    const isBlack = game!.black_player.name === name;
    isBlack ? game!.black_player.socketId = socketId : game!.white_player.socketId = socketId;
  }

  get queueList(): MMPlayer[] {
    return this.queue;
  }

  get coupledGamesList(): Map<string , ChessGame> {
    return this.coupledGames;
  }

  get socketMapList(): Map<string, string> {
    return this.socketMap;
  }


  protected maxPlayers: number;
  protected state: boolean;

  constructor(maxPlayers: number) {
    this.maxPlayers = maxPlayers;
    this.state = true;
    this.socketMap = new Map();
  }

  isReadyToMatch(
    p: MMPlayer,
    mode: JoinQueuOption
  ): [boolean , MMPlayer | null] {
    const filtredQueue = this.queue.filter(
      (player) =>
        player.rank === p.rank &&
        player.options?.mode === mode.mode &&
        player.options?.timer === mode.timer
    );
      
    if (filtredQueue.length === 0) return [false , null];

    const random = Math.floor(Math.random() * filtredQueue.length);
    return [true , filtredQueue[random]];
  }

  static BuildGame(firstPlayer: MMPlayer, secondPlayer: MMPlayer , options: JoinQueuOption): IGame {
    let random = Math.floor(Math.random() * 2);
    const white_player = random === 0 ? firstPlayer : secondPlayer;
    const black_player = random === 0 ? secondPlayer : firstPlayer;
    const matchId = this.generateMatchId(firstPlayer, secondPlayer);
    const game: IGame = {
      matchId,
      white_player,
      matchOptions: options,
      black_player,
      createdAt: new Date(),
      winnder: "",
    };

    return game;
  }

  static generateMatchId(
    firstPlayer: MMPlayer,
    secondPlayer: MMPlayer
  ): string {
    return firstPlayer.id + secondPlayer.id;
  }

  getRandomRoomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  //modifier avec proposition de lucas + logarithmique un truc du genre
  rankPlayers(player: MMPlayer): number | null {
    if (player.elo < 800) {
      return 1;
    } else if (player.elo < 1000) {
      return 2;
    } else if (player.elo < 1200) {
      return 3;
    } else if (player.elo < 1400) {
      return 4;
    } else if (player.elo < 1600) {
      return 5;
    } else if (player.elo < 1800) {
      return 6;
    } else if (player.elo < 2000) {
      return 7;
    }
    return null;
  }

  addPlayerToQueue(
    player: MMPlayer,
    socket: string,
    mode: JoinQueuOption
  ): IGame | number {
    if (this.queue.length >= this.maxPlayers) {
      return -1;
    }
    player.rank = this.rankPlayers(player);
    player.options = mode;
    const [isReadyToMatch, matchPlayer] = this.isReadyToMatch(player, mode);
    if (!isReadyToMatch) {
      this.queue.push(player);
      this.socketMap.set(player.id, socket);
      return -2;
    }
    const game = Queue.BuildGame(player, matchPlayer! , mode);
    this.coupledGames.set(game.matchId , new ChessGame());
    this.games.push(game);
    this.queue = this.queue.filter(
      (p) => p.id !== matchPlayer!.id && p.id !== player.id
    );
    return game;
  }

  removePlayerFromQueue(clientId: string): void {
    var playerId = '';
    this.socketMap.forEach((value, key) => {
      if (value === clientId) {
        playerId = key;
      }
    });
    this.queue = this.queue.filter((p) => p.id !== playerId);
    this.socketMap.delete(playerId);
  }
}
