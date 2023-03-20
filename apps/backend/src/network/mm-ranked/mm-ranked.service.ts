import { Injectable } from '@nestjs/common';
import { Nt } from '@TRPI/core';
import { Socket } from 'socket.io';
import { MatchMakingService } from '../match-making/match-making.service';

@Injectable()
export class MmRankedService {}
