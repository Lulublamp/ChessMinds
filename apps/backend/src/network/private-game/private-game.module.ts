import { Module } from '@nestjs/common';
import { PrivateGameService } from './private-game.service';
import { PrivateGameGateway } from './private-game.gateway';
import { JoueursModule } from 'src/joueurs/joueurs.module';
import { MatchMakingModule } from '../match-making/match-making.module';

@Module({
  imports: [JoueursModule, MatchMakingModule],
  providers: [PrivateGameService, PrivateGameGateway],
})
export class PrivaGameModule {}