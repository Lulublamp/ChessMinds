import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Req
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JoueursService } from 'src/joueurs/joueurs.service';
import { JwtAuthGuard } from './jwt-auth.gard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly joueursService: JoueursService,
  ) { }

  @Post('login')
  async login(
    @Body('adresseMail') adresseMail: string,
    @Body('motDePasse') motDePasse: string,
  ) {
    const joueur = await this.joueursService.connexionJoueur(
      adresseMail,
      motDePasse,
    );

    if (!joueur) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Mot de passe ou adresse mail incorrecte.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.authService.login(joueur);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    return {
      adresseMail: req.user.adresseMail,
      pseudo: req.user.pseudo,
    };
  }
  
}
