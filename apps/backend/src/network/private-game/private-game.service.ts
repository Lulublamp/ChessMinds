import { Injectable } from '@nestjs/common';
import { Nt } from '@TRPI/core';
import { MatchMakingService } from '../match-making/match-making.service';

@Injectable()
export class PrivateGameService {
  readonly pLobby : Nt.Lobby;

  constructor(private matchMakingService: MatchMakingService) {
    this.pLobby = new Nt.Lobby();
  }

  private mapPlayer(payload: any): Nt.IMMPlayer {
    const options : Nt.JoinQueuOption = {
      mode: Nt.MATCHMAKING_MODE.PRIVATE,
      timer: Nt.MATCHMAKING_MODES_TIMERS.RAPID
    }
    const player: Nt.IMMPlayer = {
      id: payload.idJoueur,
      name: payload.pseudo,
      mail: payload.adresseMail,
      elo: null,
      options: options,
    };
    return player;
  }

  public createLobby(host: any, guest: any): Nt.PrivateLobby {
    const hostPlayer = this.mapPlayer(host);
    const guestPlayer = this.mapPlayer(guest);
    try{
      const lobby = this.pLobby.createLobby(hostPlayer, guestPlayer);
      return lobby;
    }
    catch(e){
      console.log(e);
    }
    
  }

  public leaveLobby(lobbyId: string): void {
    this.pLobby.leaveLobby(lobbyId);
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

  public startGame(lobbyId: string, sockId1: string, sockId2: string): Nt.IGame {
    try{
      const game = this.pLobby.startGame(lobbyId, sockId1, sockId2);
      return this.matchMakingService.queue.mapPrivateGame(game);
    }
    catch(e){
      console.log(e);
    }
  }

  public leaveOnDisconnect(sockId: string): string | null {
    return this.pLobby.leaveOnDisconnect(sockId);
  }

}
