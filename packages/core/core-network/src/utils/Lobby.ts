import { ChessGame, Color, Player } from "../../../core-algo";
import { PPlayer, Match, Queue } from "./Queue";



export interface PrivateLobby {
  code: string;
  host: PPlayer;
  players: PPlayer[];
  ready: [boolean, boolean];
  status: 'waiting' | 'playing' | 'ended';
}

export class Lobby {
  protected lobbies: PrivateLobby[] = [];

  constructor() {}

  createLobby(host: PPlayer): PrivateLobby {
    const code = this.generateCode();
    const lobby: PrivateLobby = {
      code,
      host,
      players: [],
      ready: [false, false],
      status: 'waiting',
    };
    this.lobbies.push(lobby);
    return lobby;
  }

  joinLobby(code: string, player: PPlayer): PrivateLobby | null {
    const lobby = this.lobbies.find((lobby) => lobby.code === code);
    if (!lobby) return null;
    lobby.players.push(player);
    return lobby;
  }

  leaveLobby(code: string, player: PPlayer): PrivateLobby | null {
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

  playerReady(player: PPlayer): PrivateLobby | null {
    const lobby = this.lobbies.find((lobby) => {
      return lobby.players.find((p) => p.id === player.id);
    });
    if (!lobby) return null;
    const index = lobby.players.findIndex((p) => p.id === player.id);
    lobby.ready[index] = true;
    return lobby;
  }

  playerUnready(player: PPlayer): PrivateLobby | null {
    const lobby = this.lobbies.find((lobby) => {
      return lobby.players.find((p) => p.id === player.id);
    });
    if (!lobby) return null;
    const index = lobby.players.findIndex((p) => p.id === player.id);
    lobby.ready[index] = false;
    return lobby;
  }

  startGame(code: string): Match | null {
    const lobby = this.lobbies.find((lobby) => lobby.code === code);
    if (!lobby) return null;
    const match = Queue.buildMatch(lobby.players);
    lobby.status = 'playing';
    return match;
  }

}




