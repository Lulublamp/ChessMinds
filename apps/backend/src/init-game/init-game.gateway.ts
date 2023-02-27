import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { CoreEvents, NAMESPACE_TYPES } from '@TRPI/core-nt';

@WebSocketGateway({
  namespace: 'aze',
  cors: true,
  origins: '*:*',
})
export class InitGameGateway {
  @SubscribeMessage(CoreEvents.INIT_GAME)
  handleInitGame(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
