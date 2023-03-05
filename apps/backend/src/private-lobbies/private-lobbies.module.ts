import { Module } from '@nestjs/common';
import { InitGameGateway } from 'src/init-game/init-game.gateway';
import { PrivateLobbiesGateway } from './private-lobbies.gateway';
import { LobbiesService } from './private-lobbies.service';


@Module({
  imports: [],
  controllers: [],
  providers: [InitGameGateway, PrivateLobbiesGateway, LobbiesService],
})
export class PrivateLobbiesModule {}
