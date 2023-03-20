/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MatchMakingService } from './match-making.service';
import { MatchMakingGateway } from './match-making.gateway';
import { MmRankedService } from '../mm-ranked/mm-ranked.service';
import { MmUnrankedService } from '../mm-unranked/mm-unranked.service';
import { PrivateGameService } from '../private-game/private-game.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MatchMakingService , MatchMakingGateway , MmRankedService , MmUnrankedService , PrivateGameService],
})
export class MatchMakingModule {}
