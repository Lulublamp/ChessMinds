import { IGame } from "../interfaces/game";
import { IMMPlayer, IRPlayer } from "../interfaces/mmplayer";
import { MATCHMAKING_MODES_TIMERS } from "../Namespace";
import { Queue } from "./Queue";



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
  protected invitaions: Map<number, number[]> = new Map();

  constructor() {}

  createLobby(host: IMMPlayer, player2: IMMPlayer): PrivateLobby {
    const id = `${host.id}-${player2.id}`;
    if(this.lobbies.find((lobby) => lobby.id === id)) throw new Error('Lobby already exists');
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

  leaveLobby(id: string): void {
    this.lobbies = this.lobbies.filter((lobby) => lobby.id !== id);
  }

  leaveOnDisconnect(playerid: string): string | null {
    const lobby = this.lobbies.find((lobby) => lobby.players.find((player) => player.id === playerid));
    if (!lobby) return null;
    this.leaveLobby(lobby.id);
    return lobby.id;
  }
    

  changeTimer(id: string, timer: MATCHMAKING_MODES_TIMERS): PrivateLobby | null {
    const lobby = this.lobbies.find((lobby) => lobby.id === id);
    if (!lobby) return null;
    lobby.players.forEach((player) => lobby.ready[player.id] = false);
    lobby.players.forEach((player) => player.options.timer = timer);
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

  inviteAmi(idSend: number, idRecieve: number): void {
    if (this.invitaions.has(idRecieve)) {
      const invitations = this.invitaions.get(idRecieve);
      if (invitations && !invitations.includes(idSend)) {
        invitations.push(idSend);
      }
    } else {
      this.invitaions.set(idRecieve, [idSend]);
    }
  }

  inviteResponse(idSend: number, idRecieve: number, response: boolean): void {
    if (this.invitaions.has(idRecieve)) {
      const invitations = this.invitaions.get(idRecieve);
      if (invitations) {
        const res = invitations.filter((id) => id !== idSend);
        if(res.length === 0) this.invitaions.delete(idRecieve);
        else this.invitaions.set(idRecieve, res);
        return;
      }
    }
    throw new Error('Invitation not found');
  }

  getInvitations(id: number): number[] | null {
    if (this.invitaions.has(id)) {
      const invitaions = this.invitaions.get(id);
      if (invitaions) {
        return invitaions;
      }
    }
    return null;
  }

  lobbyPlayerUnready(id: string, playerId: string): PrivateLobby | null {
    const lobby = this.lobbies.find((lobby) => lobby.id === id);
    if (!lobby) return null;
    lobby.ready[playerId] = false;
    return lobby;
  }

  startGame(id: string, sockId: string, sockId2: string): IGame {
    const lobby = this.lobbies.find((lobby) => lobby.id === id);
    if (!lobby) throw new Error('Lobby not found');
    lobby.players.forEach((player) => {
      if (lobby.ready[player.id] === false) throw new Error('Not all players are ready');
    });
    const pWithRank: IRPlayer = {
      ...lobby.players[0],
      rank: null,
      socketId: sockId,
    }
    const pWithRank2: IRPlayer = {
      ...lobby.players[1],
      rank: null,
      socketId: sockId2,
    }

    const game = Queue.BuildGame(pWithRank, pWithRank2);
    this.lobbies = this.lobbies.filter((lobby) => lobby.id !== id);
    return game;

  }

}




