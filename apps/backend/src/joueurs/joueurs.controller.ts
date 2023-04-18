import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
  Request,
  HttpException,
  HttpStatus,
  UseGuards,
  Query
} from '@nestjs/common';
import { JoueurDto } from './DTO/joueurs.dto';
import { JoueursService } from './joueurs.service';
import { Joueur } from './entities/joueur.entity';
import { PlayerAlreadyExists } from 'src/errors/bErrors';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';

@Controller('joueurs')
export class JoueursController {
  constructor(private readonly joueursService: JoueursService) { }


  @Post('inscription')
  async inscriptionJoueur(@Body() joueur: JoueurDto) {
    try {
      return await this.joueursService.inscriptionJoueur(joueur);
    } catch (error) {
      if (error instanceof PlayerAlreadyExists) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: "L'utilisateur existe déjà.",
          },
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  @Post('friends/add')
  async addFriend(@Body() payload: Pick<Joueur, 'adresseMail' | 'pseudo'>) {
    try {
      console.log(payload);
      return await this.joueursService.addFriend(
        payload.adresseMail,
        payload.pseudo,
      );
    } catch (error) {
      throw new NotFoundException("Erreur lors de l'ajout de l'ami");
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('dateInscription')
  async getDateInscription(@Request() req): Promise<Date> {
    return this.joueursService.getDateInscription(req.user);
  }
}