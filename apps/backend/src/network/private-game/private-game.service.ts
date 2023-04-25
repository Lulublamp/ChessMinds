import { Injectable } from '@nestjs/common';
import { Nt } from '@TRPI/core';

@Injectable()
export class PrivateGameService {
  readonly pLobby : Nt.Lobby;

  constructor() {
    this.pLobby = new Nt.Lobby();
  }

  private mapPlayer(payload: any): Nt.IMMPlayer {
    const player: Nt.IMMPlayer = {
      id: payload.idJoueur,
      name: payload.pseudo,
      mail: payload.adresseMail,
      elo: null,
      options: null,
    };
    return player;
  }

  public createLobby(host: any, guest: any): Nt.PrivateLobby {
    const hostPlayer = this.mapPlayer(host);
    const guestPlayer = this.mapPlayer(guest);
    const lobby = this.pLobby.createLobby(hostPlayer, guestPlayer);
    return lobby;
  }

  public changeTimer(lobbyId: string, timer: Nt.MATCHMAKING_MODES_TIMERS): Nt.PrivateLobby {
    return this.pLobby.changeTimer(lobbyId, timer);
  }

  public isHost(lobbyId: string, playerId: string): boolean {
    return this.pLobby.isHost(lobbyId, playerId);
  }

  public lobbyPlayerReady(lobbyId: string, playerId: string): Nt.PrivateLobby {
    return this.pLobby.lobbyPlayerReady(lobbyId, playerId);
  }

  public lobbyPlayerUnready(lobbyId: string, playerId: string): Nt.PrivateLobby {
    return this.pLobby.lobbyPlayerUnready(lobbyId, playerId);
  }

}
