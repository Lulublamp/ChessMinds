import { Injectable } from '@nestjs/common';
import { Nt } from '@TRPI/core';

@Injectable()
export class MatchMakingService {
  readonly queue: Nt.Queue;
  readonly pLobby: Nt.Lobby;

  constructor() {
    this.queue = new Nt.Queue(100);
    this.pLobby = new Nt.Lobby();
  }
}
