/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MmRankedGateway } from 'src/mm-ranked/mm-ranked.gateway';
import { MmUnRankedGateway } from 'src/mm-un-ranked/mm-un-ranked.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [MmUnRankedGateway , MmRankedGateway],
})
export class MatchMakingModule {}
