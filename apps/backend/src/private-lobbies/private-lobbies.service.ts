import { Injectable } from '@nestjs/common';
import { Nt } from '@TRPI/core';

@Injectable()
export class LobbiesService {
  readonly pLobby: Nt.Lobby;

  constructor() {
    this.pLobby = new Nt.Lobby();
  }
}