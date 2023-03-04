/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { InitGameGateway } from 'src/init-game/init-game.gateway';
import { MmRankedGateway } from 'src/mm-ranked/mm-ranked.gateway';
import { MmUnRankedGateway } from 'src/mm-un-ranked/mm-un-ranked.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [MmUnRankedGateway , MmRankedGateway , InitGameGateway],
})
export class MatchMakingModule {}
