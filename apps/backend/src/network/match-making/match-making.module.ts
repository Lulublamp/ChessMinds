/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MatchMakingService } from './match-making.service';
import { MatchMakingGateway } from './match-making.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [MatchMakingService , MatchMakingGateway],
  exports: [MatchMakingService],
})
export class MatchMakingModule {}
