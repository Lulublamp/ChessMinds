/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MatchMakingService } from './match-making.service';
import { MatchMakingGateway } from './match-making.gateway';
import { PrivateGameService } from '../private-game/private-game.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MatchMakingService , MatchMakingGateway  , PrivateGameService],
})
export class MatchMakingModule {}
