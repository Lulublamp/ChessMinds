import { Injectable } from '@nestjs/common';
import { Nt } from '@TRPI/core';

@Injectable()
export class MatchMakingService {
  readonly queue: Nt.Queue;

  constructor() {
    this.queue = new Nt.Queue(100);
  }
}
