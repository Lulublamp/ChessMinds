import { Socket } from "socket.io";
import { ChessGame, Color, Player } from "../../../core-algo";

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


export interface Match {
  matchId: string;
  players: PPlayer[];
  createdAt: Date;
  endedAt: Date | null;
  winner: PPlayer | null;
  state: MatchState;
  currentTurn: PPlayer;
}



export class Queue {
  protected coupledPlayers: Match[] = [];
  protected coupledGames: Map<string , ChessGame>;
  protected maxPlayers: number;
  protected state: boolean;
  protected players: PPlayer[];

  constructor(maxPlayers: number) {
    this.players = [];
    this.maxPlayers = maxPlayers;
    this.state = true;
    this.coupledGames = new Map();
  }

  isFull(): boolean {
    return this.players.length >= this.maxPlayers;
  }

  isEmpty(): boolean {
    return this.players.length <= 0;
  }

  isReady(): boolean {
    if (this.isEmpty()) return false;
    return true;
  }

  isReadyToMatch(p : PPlayer){
    return this.players.filter((player) => player.rank === p.rank).length > 0;
  }

  addPlayer(player: PPlayer): [string, Match] | number {
    console.log('add player id : ' + player.socket);
    player.rank = this.rankPlayers(player);
    const isReady = this.isReady();
    const isReadyToMatch = this.isReadyToMatch(player);
    const maybeMatch: [string , Match] | number = isReady ? (isReadyToMatch ? this.setMatch(player) : this.players.push(player)) : this.players.push(player);
    if (typeof maybeMatch === 'number') return -99;
    return maybeMatch;
  }

  removePlayer(name: string, socketId: string): void {
    console.log('remove player id : ' + socketId);
    this.players = this.players.filter((player) => player.name !== name && player.socket !== socketId);
    console.log('remove player id : ' + socketId + ' done -> ' + name);
  }

  setMatch(player: PPlayer): [string, Match] {
    console.log('setting the match : ' + player.name)
    const sameRank = this.players.filter((p) => p.rank === player.rank);
    let random = this.maxPlayers - sameRank.length;
    
    while (random > sameRank.length) {
      const rand = Math.floor(Math.random() * sameRank.length);
      if (rand !== random) {
        random = rand;
      }
    }
    console.log('found');
    const newMatch: Match = Queue.buildMatch([sameRank[random], player]);
    this.coupledPlayers.push(newMatch);
    this.coupledGames.set(newMatch.matchId , new ChessGame());
    this.players = this.players.filter((p) => p.id !== sameRank[random].id && p.id !== player.id);
    return [this.getRandomRoomId() , newMatch];
  }
  
  getRandomRoomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static excludeSocket(match: Match): Match{
    // match.players.forEach((player) => {
    //   delete player.socket;
    // });
    // console.log(match);

    return match;
  }

  static buildMatch(player: PPlayer[]){
    
    const newChessGame = new ChessGame();
    player[0].player = newChessGame.getPlayer(Color.White)
    player[1].player = newChessGame.getPlayer(Color.Black)
    const newMatch: Match = {
      matchId: Math.random().toString(36).substr(2, 9),
      players: player,
      createdAt: new Date(),
      endedAt: null,
      winner: null,
      state: MatchState.waiting,
      currentTurn: Math.random() > 0.5 ? player[0] : player[1],
    }
    return newMatch;
  }

  //modifier avec proposition de lucas + logarithmique un truc du genre
  rankPlayers(player: PPlayer): number | null {
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

  getCoupledPlayers(): Match[] {
    return this.coupledPlayers;
  }

  getPlayers(): PPlayer[] {
    return this.players;
  }


  
}