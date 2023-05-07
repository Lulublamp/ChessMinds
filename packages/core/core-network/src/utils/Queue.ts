import { Socket } from "socket.io";
import { ChessGame, Color, Player } from "../../../core-algo";
// import { lobbyPlayer, MMPlayer } from "../interfaces/emitEvents";
import { JoinQueuOption } from "../MatchMaking";
import { MATCHMAKING_MODE } from "../Namespace";
import { IMMPlayer, IRPlayer } from "../interfaces/mmplayer";
import { IGame } from "../interfaces/game";

export class Queue {
  protected games: IGame[] = [];
  protected queue: IRPlayer[] = [];
  protected privateQueue: Map<string , IMMPlayer[]> = new Map<string, IMMPlayer[]>();
  protected coupledGames: Map<string, ChessGame> = new Map<string, ChessGame>();
  private matchStarted: Map<string, IGame> = new Map();
  private matchPending: Map<string, IGame> = new Map();
  protected socketMap: Map<string, string>;
  protected maxPlayers: number;
  protected state: boolean;


  get gamesList(): IGame[] {
    return this.games;
  }

  get queueList(): IRPlayer[] {
    return this.queue;
  }

  get coupledGamesMap(): Map<string, ChessGame> {
    return this.coupledGames;
  }

  get socketMaps(): Map<string, string> {
    return this.socketMap;
  }

  get matchStartedMap(): Map<string, IGame> {
    return this.matchStarted;
  }

  public setInStartedMap(id: string, game: IGame) {
    this.matchStarted.set(id, game);
  }

  public removeFromStartedMap(id: string) {
    this.matchStarted.delete(id);
  }

  
  get matchPendingMap(): Map<string, IGame> {
    return this.matchPending;
  }

  public setInPendingMap(id: string, game: IGame) {
    this.matchPending.set(id, game);
  }

  public removeFromPendingMap(id: string) {
    this.matchPending.delete(id);
  }

  

  constructor(maxPlayers: number) {
    this.maxPlayers = maxPlayers;
    this.state = true;
    this.socketMap = new Map();
  }

  isReadyToMatch(p: IRPlayer): [boolean, IRPlayer | null] {
    const filtredQueue = this.queue.filter(
      (player) =>
        player.rank === p.rank &&
        player.options?.mode === p.options.mode &&
        player.options?.timer === p.options.timer &&
        player.id !== p.id
    );
    if (filtredQueue.length === 0) return [false, null];

    const random = Math.floor(Math.random() * filtredQueue.length);
    return [true, filtredQueue[random]];
  }

  addPlayerToQueue(player: IMMPlayer, socket: string): IGame | number {
    if (this.queue.length >= this.maxPlayers) {
      return -1;
    }

    const pWithRank: IRPlayer = {
      ...player,
      rank: null,
      socketId: null,
    };

    pWithRank.rank = this.rankPlayers(pWithRank);
    pWithRank.socketId = socket;

    const [isReadyToMatch, matchPlayer] = this.isReadyToMatch(pWithRank);
    if (!isReadyToMatch) {
      this.queue.push(pWithRank);
      this.socketMap.set(pWithRank.id, socket);
      return -2;
    }
    const game = Queue.BuildGame(pWithRank, matchPlayer!);
    this.games.push(game);
    this.coupledGames.set(game.matchId, new ChessGame());
    this.queue = this.queue.filter(
      (p) => p.id !== matchPlayer!.id && p.id !== player.id
    );
    return game;
  }

  removePlayerFromQueue(clientId: string): void {
    var playerId = "";
    this.socketMap.forEach((value, key) => {
      if (value === clientId) {
        playerId = key;
      }
    });
    this.queue = this.queue.filter((p) => p.id !== playerId);
    this.socketMap.delete(playerId);
  }

  mapPrivateGame(game: IGame): IGame {
    this.games.push(game);
    this.coupledGames.set(game.matchId, new ChessGame());
    return game;
  }

  destroyGame(matchId: string): void {
    this.games = this.games.filter((game) => game.matchId !== matchId);
    this.coupledGames.delete(matchId);
  }

  public mutateGameSocketId(matchId: string, socketId: string, name: string) {
    const game = this.games.find((game) => game.matchId === matchId);
    const isBlack = game!.black_player.name === name;
    isBlack
      ? (game!.black_player.socketId = socketId)
      : (game!.white_player.socketId = socketId);
    return game;
  }

  static BuildGame(firstPlayer: IRPlayer, secondPlayer: IRPlayer): IGame {
    let random = Math.floor(Math.random() * 2);
    const white_player = random === 0 ? firstPlayer : secondPlayer;
    const black_player = random === 0 ? secondPlayer : firstPlayer;
    const matchId = this.generateMatchId(firstPlayer, secondPlayer);
    const game: IGame = {
      matchId,
      white_player,
      black_player,
      matchOptions: firstPlayer.options || secondPlayer.options,
      createdAt: new Date(),
      state: {
        state: "ongoing",
        winner: undefined,
      },
    };

    return game;
  }

  static generateMatchId(
    firstPlayer: IRPlayer,
    secondPlayer: IRPlayer
  ): string {
    return firstPlayer.socketId + secondPlayer.socketId!; //à revoir si on est vraiment sûr que les socketId sont toujours dispo au moment de la création de la partie
  }

  getRandomRoomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  //modifier avec proposition de lucas + logarithmique un truc du genre
  rankPlayers(player: IRPlayer): number | null {
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

  public addToPrivateQueue(key: string, player: IMMPlayer) {
    
    // key = otherkey;
    if (!this.privateQueue.has(key)) {
      console.log('Init PG')
      this.privateQueue.set(key, []);
    }
    const currentQueue = this.privateQueue.get(key)!;

    if (currentQueue.length >= 2) {
      return null;
    } else {
      console.log('Add to PG')
      this.privateQueue.set(key, [...currentQueue, player]);
    }
    console.log('[LOGS] addToPrivateQueue : ', this.privateQueue.get(key)!)
  }

  public getFromPrivateQueue(key: string): IMMPlayer[] | undefined {
    return this.privateQueue.get(key);
  }

  public removeFromPrivateQueue(key: string, playerId: string): void {
    if (this.privateQueue.has(key)) {
      const players = this.privateQueue.get(key);
      if (players) {
        this.privateQueue.set(
          key,
          players.filter((player) => player.id !== playerId)
        );
      }
    }
  }

  public deletePrivateQueue(key: string): void {
    this.privateQueue.delete(key);
  }

  
}
