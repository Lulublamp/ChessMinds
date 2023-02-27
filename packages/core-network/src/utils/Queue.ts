import { Socket } from "socket.io";

export interface Player {
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
  players: Player[];
  createdAt: Date;
  endedAt: Date;
  winner: Player | null;
  state: MatchState;
}



export class Queue {
  protected coupledPlayers: Match[] = [];
  protected maxPlayers: number;
  protected state: boolean;
  protected players: Player[];

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

  isReadyToMatch(p : Player){
    return this.players.filter((player) => player.rank === p.rank).length > 0;
  }

  addPlayer(player: Player): [string, Match] | number {
    player.rank = this.rankPlayers(player);
    const maybeMatch: [string , Match] | number = this.isReady() ? (this.isReadyToMatch(player) ? this.setMatch(player) : this.players.push(player))  : this.players.push(player);
    return maybeMatch;
  }

  removePlayer(player: Player): void {
    this.players = this.players.filter((p) => p.id !== player.id);
  }

  setMatch(player: Player): [string, Match] {
    const sameRank = this.players.filter((p) => p.rank === player.rank);
    console.log(sameRank);
    let random = this.maxPlayers - sameRank.length;
    while (random > sameRank.length) {
      const rand = Math.floor(Math.random() * sameRank.length);
      if (rand !== random) {
        random = rand;
      }
    }
    console.log('P1 : ' + sameRank[random].id + ' P2 : ' + player.id);

    const newMatch: Match = {
      players: [sameRank[random], player],
      createdAt: new Date(),
      endedAt: new Date(),
      winner: null,
      state: MatchState.playing,
    }
    this.coupledPlayers.push(newMatch);
    console.log('before filter : ')
    console.log(this.players)
    this.players = this.players.filter((p) => p.id !== sameRank[random].id && p.id !== player.id);
    console.log('after filter : ')
    console.log(this.players)
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

  //modifier avec proposition de lucas + logarithmique un truc du genre
  rankPlayers(player: Player): number | null {
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

  getPlayers(): Player[] {
    return this.players;
  }


  
}