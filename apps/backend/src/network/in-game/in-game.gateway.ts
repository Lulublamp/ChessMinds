import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Nt } from '@TRPI/core';
import { EVENT_TYPES } from '@TRPI/core/core-network';
import { MatchMakingService } from '../match-making/match-making.service';

@WebSocketGateway({
  namespace: Nt.NAMESPACE_TYPES.IN_GAME,
  cors: true,
})
export class InGameGateway {

  constructor(private matchMakingService: MatchMakingService) {}

  @SubscribeMessage(EVENT_TYPES.MAKE_MOVE)
  handleMessage(client: any, payload: any) {
    console.log('message: ' + payload);
  }
}
