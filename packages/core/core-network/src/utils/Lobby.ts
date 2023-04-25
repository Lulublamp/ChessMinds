import { IMMPlayer } from "../interfaces/mmplayer";
import { MATCHMAKING_MODES_TIMERS } from "../Namespace";



export interface PrivateLobby {
  id: string;
  host: IMMPlayer;
  players: IMMPlayer[];
  timer: MATCHMAKING_MODES_TIMERS;
  ready: { [key: string]: boolean};
  status: 'waiting' | 'playing' | 'ended';
}

export class Lobby {
  protected lobbies: PrivateLobby[] = [];

  constructor() {}

  createLobby(host: IMMPlayer, player2: IMMPlayer): PrivateLobby {
    const id = `${host.id}-${player2.id}`;
    const lobby: PrivateLobby = {
      id,
      host,
      players: [host, player2],
      timer: MATCHMAKING_MODES_TIMERS.RAPID,
      ready: { [host.id]: false, [player2.id]: false },
      status: 'waiting',
    };
    this.lobbies.push(lobby);
    return lobby;
  }

  changeTimer(id: string, timer: MATCHMAKING_MODES_TIMERS): PrivateLobby | null {
    const lobby = this.lobbies.find((lobby) => lobby.id === id);
    if (!lobby) return null;
    lobby.timer = timer;
    return lobby;
  }

  isHost(id: string, playerId: string): boolean {
    const lobby = this.lobbies.find((lobby) => lobby.id === id);
    if (!lobby) return false;
    return lobby.host.id === playerId;
  }

  lobbyPlayerReady(id: string, playerId: string): PrivateLobby | null {
    const lobby = this.lobbies.find((lobby) => lobby.id === id);
    if (!lobby) return null;
    lobby.ready[playerId] = true;
    return lobby;
  }

  lobbyPlayerUnready(id: string, playerId: string): PrivateLobby | null {
    const lobby = this.lobbies.find((lobby) => lobby.id === id);
    if (!lobby) return null;
    lobby.ready[playerId] = false;
    return lobby;
  }

  // joinLobby(code: string, player: lobbyPlayer): PrivateLobby | null {
  //   const lobby = this.lobbies.find((lobby) => lobby.code === code);
  //   if (!lobby) return null;
  //   lobby.players.push(player);
  //   lobby.ready[player.id] = false;
  //   return lobby;
  // }

  // leaveLobby(code: string, player: lobbyPlayer): PrivateLobby | null {
  //   const lobby = this.lobbies.find((lobby) => lobby.code === code);
  //   if (!lobby) return null;
  //   lobby.players = lobby.players.filter((p) => p.id !== player.id);
  //   if(lobby.players.length === 0 ) this.lobbies = this.lobbies.filter((l) => l.code !== code);
  //   if(lobby.host.id === player.id) lobby.host = lobby.players[0];
  //   return lobby;
  // }

  // generateCode(): string {
  //   let code = '';
  //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //   for (let i = 0; i < 5; i++) {
  //     code += characters.charAt(Math.floor(Math.random() * characters.length));
  //   }
  //   return code;
  // }

  // playerReady(code: string, player: lobbyPlayer): PrivateLobby | null {
  //   console.log("Looking for lobby", code);
  //   const lobby = this.lobbies.find((lobby) => lobby.code === code);
  //   console.log("Ready in");
  //   console.log(lobby);
  //   if (!lobby) return null;
  //   lobby.ready[player.id] = true;
  //   return lobby;
  // }

  // playerUnready(code: string, player: lobbyPlayer): PrivateLobby | null {
  //   const lobby = this.lobbies.find((lobby) => lobby.code === code);
  //   if (!lobby) return null;
  //   lobby.ready[player.id] = false;
  //   return lobby;
  // }

  // startGame(code: string): Match<lobbyPlayer> | null {
  //   const lobby = this.lobbies.find((lobby) => lobby.code === code);
  //   if (!lobby) return null;
  //   if (lobby.players.length < 2) return null;
  //   if (Object.values(lobby.ready).some((r) => !r)) return null;
  //   const match = Lobby.buildMatch(lobby.players);
  //   lobby.status = 'playing';
  //   return match;
  // }

  // static buildMatch(players: lobbyPlayer[]): Match<lobbyPlayer> {
  //   const match: Match<lobbyPlayer> = {
  //     matchId: Math.random().toString(36).substring(7),
  //     players,
  //     createdAt: new Date(),
  //     endedAt: null,
  //     winner: null,
  //     state: 'waiting',
  //     currentTurn: players[0],
  //   };
  //   return match;
  // }

}




