import { ChessGame, Color, Player } from "../../../core-algo";
import { PPlayer, Match, Queue } from "./Queue";
import { lobbyPlayer } from "../interfaces/emitEvents";



export interface PrivateLobby {
  code: string;
  host: lobbyPlayer;
  players: lobbyPlayer[];
  ready: { [key: string]: boolean};
  status: 'waiting' | 'playing' | 'ended';
}

export class Lobby {
  protected lobbies: PrivateLobby[] = [];

  constructor() {}

  createLobby(host: lobbyPlayer): PrivateLobby {
    const code = this.generateCode();
    const lobby: PrivateLobby = {
      code,
      host,
      players: [host],
      ready: { [host.id]: false },
      status: 'waiting',
    };
    this.lobbies.push(lobby);
    return lobby;
  }

  joinLobby(code: string, player: lobbyPlayer): PrivateLobby | null {
    const lobby = this.lobbies.find((lobby) => lobby.code === code);
    if (!lobby) return null;
    lobby.players.push(player);
    lobby.ready[player.id] = false;
    return lobby;
  }

  leaveLobby(code: string, player: lobbyPlayer): PrivateLobby | null {
    const lobby = this.lobbies.find((lobby) => lobby.code === code);
    if (!lobby) return null;
    lobby.players = lobby.players.filter((p) => p.id !== player.id);
    if(lobby.players.length === 0 ) this.lobbies = this.lobbies.filter((l) => l.code !== code);
    if(lobby.host.id === player.id) lobby.host = lobby.players[0];
    return lobby;
  }

  generateCode(): string {
    let code = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  playerReady(code: string, player: lobbyPlayer): PrivateLobby | null {
    console.log("Looking for lobby", code);
    const lobby = this.lobbies.find((lobby) => lobby.code === code);
    console.log("Ready in");
    console.log(lobby);
    if (!lobby) return null;
    lobby.ready[player.id] = true;
    return lobby;
  }

  playerUnready(code: string, player: lobbyPlayer): PrivateLobby | null {
    const lobby = this.lobbies.find((lobby) => lobby.code === code);
    if (!lobby) return null;
    lobby.ready[player.id] = false;
    return lobby;
  }

  startGame(code: string): Match<lobbyPlayer> | null {
    const lobby = this.lobbies.find((lobby) => lobby.code === code);
    if (!lobby) return null;
    if (lobby.players.length < 2) return null;
    if (Object.values(lobby.ready).some((r) => !r)) return null;
    const match = Lobby.buildMatch(lobby.players);
    lobby.status = 'playing';
    return match;
  }

  static buildMatch(players: lobbyPlayer[]): Match<lobbyPlayer> {
    const match: Match<lobbyPlayer> = {
      matchId: Math.random().toString(36).substring(7),
      players,
      createdAt: new Date(),
      endedAt: null,
      winner: null,
      state: 'waiting',
      currentTurn: players[0],
    };
    return match;
  }

}




