/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MatchMakingService } from './match-making.service';
import { MatchMakingGateway } from './match-making.gateway';
import { PrivateGameService } from '../private-game/private-game.service';
import { MatchMakingController } from './match-making.controller';
import { RencontreCoupsModule } from 'src/rencontre/rencontre-coups.module';

@Module({
  imports: [RencontreCoupsModule],
  controllers: [MatchMakingController],
  providers: [MatchMakingService , MatchMakingGateway, PrivateGameService],
  exports: [MatchMakingService],
})
export class MatchMakingModule {}
