import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Nt } from '@TRPI/core';

@WebSocketGateway({
  namespace: Nt.NAMESPACE_TYPES.IN_GAME,
  cors: true,
  origins: '*:*',
})
export class InitGameGateway {
  @SubscribeMessage(Nt.EVENT_TYPES.INIT_GAME)
  handleInitGame(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
