import { Injectable } from '@nestjs/common';
import { Nt } from '@TRPI/core';
import { Classement } from 'src/classement/entities/classement.entity';

@Injectable()
export class MatchMakingService {
  readonly queue: Nt.Queue;
  // readonly pLobby: Nt.Lobby;

  constructor() {
    this.queue = new Nt.Queue(10000);
    // this.pLobby = new Nt.Lobby();
  }

  public mapPlayer(payload: any, options: Nt.JoinQueuOption): Nt.IMMPlayer {
    const player: Nt.IMMPlayer = {
      id: payload.user.idJoueur,
      name: payload.user.pseudo,
      mail: payload.user.adresseMail,
      elo: this.getEloByOptions(payload.classement, options),
      options,
    };
    return player;
  }

  private getEloByOptions(
    classement: Classement,
    options: Nt.JoinQueuOption,
  ): number {
    switch (options.timer) {
      case Nt.MATCHMAKING_MODES_TIMERS.BULLET:
        return classement.elo_bullet;
      case Nt.MATCHMAKING_MODES_TIMERS.BLITZ:
        return classement.elo_blitz;
      case Nt.MATCHMAKING_MODES_TIMERS.RAPID:
        return classement.elo_rapide;
      default:
        throw new Error('Invalid timer option');
    }
  }

  public checkPlayerInQueue(playerId: string): boolean {
    const playerInQueue = this.queue.queueList.find((p) => p.id == playerId);
    return playerInQueue ? true : false;
  }

  public checkPlayerInGame(playerId: string): boolean {
    const playerInGame = this.queue.gamesList.find((g) => {
      console.log('checking player in game : ', playerId);
      console.log(g);
      return g.black_player.id == playerId || g.white_player.id == playerId;
    });
    console.log(playerInGame);
    return playerInGame ? true : false;
  }

  public checkPlayerInGameCB(playerId: string): string {
    const game = this.queue.gamesList.find((g) => {
      console.log('checking player in game : ', playerId);
      console.log(g);
      return g.black_player.id == playerId || g.white_player.id == playerId;
    });
    return game?.matchId;
  }

  public checkIfPlayerCanJoinQueue(id: string): boolean | string {
    console.log(id);
    const maybeMatchId = this.checkPlayerInGameCB(id);
    if (maybeMatchId) {
      return maybeMatchId;
    }
    return true;
  }
}
