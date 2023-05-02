import { Module } from '@nestjs/common';
import { InGameService } from './in-game.service';
import { InGameGateway } from './in-game.gateway';
import { MatchMakingModule } from '../match-making/match-making.module';
import { RencontreCoupsModule } from 'src/rencontre/rencontre-coups.module';
import { RencontreModule } from 'src/rencontre/rencontre.module';

@Module({
  imports: [MatchMakingModule, RencontreCoupsModule],
  providers: [InGameService, InGameGateway ],
})
export class InGameModule {}
