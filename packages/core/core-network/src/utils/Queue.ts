import { Socket } from "socket.io";
import { ChessGame, Color, Player } from "../../../core-algo";
import { lobbyPlayer, MMPlayer } from "../interfaces/emitEvents";
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
  waiting: 'waiting',
  playing: 'playing',
  ended: 'ended',
} as const;

export type MatchState = typeof MatchState[keyof typeof MatchState];


export interface Match <T> {
  matchId: string;
  players: (T extends PPlayer ? PPlayer : lobbyPlayer)[];
  createdAt: Date;
  endedAt: Date | null;
  winner: PPlayer | null;
  state: MatchState;
  currentTurn: (T extends PPlayer ? PPlayer : lobbyPlayer);
}


export interface Game{
  matchId: string;
  white_player: MMPlayer;
  black_player: MMPlayer;
  createdAt: Date;
  winnder: string
}



export class Queue {

  protected queueCanal: Map<string, Game[]>;
  protected playerCanal: Map<string, MMPlayer[]>;
  protected socketMap: Map<string , string>;
  protected coupledGames: Map<string , ChessGame>;
  protected maxPlayers: number;
  protected state: boolean;

  constructor(maxPlayers: number) {
    this.maxPlayers = maxPlayers;
    this.state = true;
    this.coupledGames = new Map();
    this.queueCanal = new Map();
    this.playerCanal = new Map();
    this.socketMap = new Map();
    this.queueCanal.set(MATCHMAKING_MODE.RANKED , []);
    this.queueCanal.set(MATCHMAKING_MODE.UNRANKED , []);
    this.queueCanal.set(MATCHMAKING_MODE.PRIVATE , []);
    this.playerCanal.set(MATCHMAKING_MODE.RANKED , []);
    this.playerCanal.set(MATCHMAKING_MODE.UNRANKED , []);
    this.playerCanal.set(MATCHMAKING_MODE.PRIVATE , []);
  }

  



  isReadyToMatch(p : MMPlayer , mode: MATCHMAKING_MODE = MATCHMAKING_MODE.RANKED): boolean{
    if (!this.playerCanal.has(mode)) return false;
    const sameRank = this.playerCanal.get(mode)?.filter((player) => player.rank === p.rank);
    if (!sameRank) return false;
    return sameRank.length > 0;
  }

  static BuildGame(firstPlayer: MMPlayer, secondPlayer: MMPlayer): Game {
    let random = Math.floor(Math.random() * 2);
    const white_player = random === 0 ? firstPlayer : secondPlayer;
    const black_player = random === 0 ? secondPlayer : firstPlayer;
    const matchId = this.generateMatchId(firstPlayer, secondPlayer);
    const game: Game = {
      matchId,
      white_player,
      black_player,
      createdAt: new Date(),
      winnder: '',
    }

    return game;
  }

  static generateMatchId(firstPlayer: MMPlayer, secondPlayer: MMPlayer): string {
    return firstPlayer.id + secondPlayer.id;
  }

  
  getRandomRoomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  //modifier avec proposition de lucas + logarithmique un truc du genre
  rankPlayers(player: MMPlayer): number | null {
    if (player.elo < 800){
      return 1;
    }else if (player.elo < 1000){
      return 2;
    }else if (player.elo < 1200){
      return 3;
    }else if(player.elo < 1400){
      return 4;
    }else if(player.elo < 1600){
      return 5;
    }else if(player.elo < 1800){
      return 6;
    }else if(player.elo < 2000){
      return 7;
    }
    return null;
  }  
  
  addPlayerToQueue(player: MMPlayer, socket: Socket , mode: MATCHMAKING_MODE): Game | number {
    if (!this.playerCanal.has(mode)) return -99;
    player.rank = this.rankPlayers(player);
    const isReadyToMatch = this.isReadyToMatch(player , mode);
    if (!isReadyToMatch) {
      this.playerCanal.get(mode)?.push(player);
      return -99;
    }


    const sameRank = this.playerCanal.get(mode)?.filter((p) => p.rank === player.rank)

    if (!sameRank) return -99;
    let random = this.maxPlayers - sameRank.length;
    
    while (random > sameRank.length) {
      const rand = Math.floor(Math.random() * sameRank.length);
      if (rand !== random) {
        random = rand;
      }
    }

    const targetedPlayer = sameRank[random];

    const game = Queue.BuildGame(targetedPlayer, player);
    this.coupledGames.set(game.matchId , new ChessGame());
    this.queueCanal.get(mode)?.push(game);
    this.playerCanal.get(mode)?.filter((p) => p.id != targetedPlayer.id && p.id != player.id);

    return game;
  }


}