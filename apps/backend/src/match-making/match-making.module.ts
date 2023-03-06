/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { InitGameGateway } from 'src/init-game/init-game.gateway';
import { MmRankedGateway } from 'src/mm-ranked/mm-ranked.gateway';
import { MmUnRankedGateway } from 'src/mm-un-ranked/mm-un-ranked.gateway';
import { MatchMakingService } from './match-making.service';
import { PrivateLobbiesGateway } from 'src/private-lobbies/private-lobbies.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [MmUnRankedGateway , MmRankedGateway , InitGameGateway, MatchMakingService, PrivateLobbiesGateway],
})
export class MatchMakingModule {}
