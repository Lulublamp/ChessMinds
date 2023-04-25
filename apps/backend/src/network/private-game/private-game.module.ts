import { Module } from '@nestjs/common';
import { PrivateGameService } from './private-game.service';
import { PrivateGameGateway } from './private-game.gateway';
import { JoueursModule } from 'src/joueurs/joueurs.module';

@Module({
  imports: [JoueursModule],
  providers: [PrivateGameService, PrivateGameGateway],
})
export class PrivaGameModule {}