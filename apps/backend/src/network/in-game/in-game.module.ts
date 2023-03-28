import { Module } from '@nestjs/common';
import { InGameService } from './in-game.service';
import { InGameGateway } from './in-game.gateway';
import { MatchMakingModule } from '../match-making/match-making.module';

@Module({
  imports: [MatchMakingModule],
  providers: [InGameService, InGameGateway],
})
export class InGameModule {}
