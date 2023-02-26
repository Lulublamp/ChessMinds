import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { CoreEvents, CoreNameSpaces } from '@TRPI/core-nt';

@WebSocketGateway({
  namespace: CoreNameSpaces.INIT_GAME,
  cors: true,
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
