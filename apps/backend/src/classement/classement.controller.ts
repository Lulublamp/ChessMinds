import { Body, Controller, Get, Param, Post, Put, UseGuards, Request, Query} from '@nestjs/common';
import { ClassementService } from './classement.service';
import { ClassementDto } from './DTO/classement.dto';
import { Classement} from './entities/classement.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';
import { TypePartie } from './entities/classement.entity';

@Controller('classement')
export class ClassementController {
  constructor(private readonly classementService: ClassementService) {}

  @UseGuards(JwtAuthGuard)
  @Get('elo')
  async getElo(@Request() req) {
    return await this.classementService.getEloByUserId(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('myrank')
  async getMyRank(@Request() req, @Query('typePartie') typePartie: TypePartie) {
    return await this.classementService.getMyRank(req.user, typePartie);
  }

  @UseGuards(JwtAuthGuard)
  @Get('myHighestElo')
  async getMyHighestElo(@Request() req, @Query('typePartie') typePartie: TypePartie) {
    return await this.classementService.getMyHighestElo(req.user, typePartie);
  }

  @Get('top20')
  async findTop20ByElo(@Query('typePartie') typePartie: TypePartie): Promise<Classement[]> {
    return await this.classementService.findTop20ByElo(typePartie);
  }
}
