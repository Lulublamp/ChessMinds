import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';
import { MatchMakingService } from './match-making.service';

@Controller('match-making')
export class MatchMakingController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly matchMakingService: MatchMakingService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async checkMatchMaking(@Req() req) {
    const result = await this.matchMakingService.checkIfPlayerCanJoinQueue(
      req.user.idJoueur,
    );
    return { result };
  }
}
