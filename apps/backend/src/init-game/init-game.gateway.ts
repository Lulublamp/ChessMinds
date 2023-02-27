import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { EVENT_TYPES, NAMESPACE_TYPES } from '@TRPI/core-nt';

@WebSocketGateway({
  namespace: NAMESPACE_TYPES.IN_GAME,
  cors: true,
  origins: '*:*',
})
export class InitGameGateway {
  @SubscribeMessage(EVENT_TYPES.INIT_GAME)
  handleInitGame(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
