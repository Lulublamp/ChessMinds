import { Socket } from "socket.io";
import { ChessGame } from "../../../core-algo";

export interface PPlayer {
  socket?: Socket;
  id: string;
  name: string;
  elo: number;
  rank?: number | null;
}




const MatchState = {
  waiting: 'waiting',
  playing: 'playing',
  ended: 'ended',
} as const;

export type MatchState = typeof MatchState[keyof typeof MatchState];


export interface Match {
  players: PPlayer[];
  createdAt: Date;
  endedAt: Date | null;
  winner: PPlayer | null;
  state: MatchState;
  chessGame?: ChessGame 
}



export class Queue {
  protected coupledPlayers: Match[] = [];
  protected maxPlayers: number;
  protected state: boolean;
  protected players: PPlayer[];

  constructor(maxPlayers: number) {
    this.players = [];
    this.maxPlayers = maxPlayers;
    this.state = true;
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
    player.rank = this.rankPlayers(player);
    const maybeMatch: [string , Match] | number = this.isReady() ? (this.isReadyToMatch(player) ? this.setMatch(player) : this.players.push(player))  : this.players.push(player);
    return maybeMatch;
  }

  removePlayer(player: PPlayer): void {
    this.players = this.players.filter((p) => p.id !== player.id);
  }

  setMatch(player: PPlayer): [string, Match] {
    const sameRank = this.players.filter((p) => p.rank === player.rank);
    let random = this.maxPlayers - sameRank.length;
    
    while (random > sameRank.length) {
      const rand = Math.floor(Math.random() * sameRank.length);
      if (rand !== random) {
        random = rand;
      }
    }

    const newMatch: Match = Queue.buildMatch([sameRank[random], player]);
    this.coupledPlayers.push(newMatch);
    this.players = this.players.filter((p) => p.id !== sameRank[random].id && p.id !== player.id);
    return [this.getRandomRoomId() , newMatch];
  }
  
  getRandomRoomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static excludeSocket(match: Match): Match{
    match.players.forEach((player) => {
      delete player.socket;
    });
    console.log(match);

    return match;
  }

  static buildMatch(player: PPlayer[]){
    
    // const newChessGame = new ChessGame();
    

    const newMatch: Match = {
      players: player,
      createdAt: new Date(),
      endedAt: null,
      winner: null,
      state: MatchState.waiting,
      // chessGame: newChessGame
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