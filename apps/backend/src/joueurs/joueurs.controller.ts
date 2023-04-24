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
import { PseudoPlayerAlreadyExists, EmailPlayerAlreadyExists } from 'src/errors/bErrors';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';

@Controller('joueurs')
export class JoueursController {
  constructor(private readonly joueursService: JoueursService) { }

  @Post('inscription')
  async inscriptionJoueur(@Body() joueur: Joueur) {
    try {
      console.log(`Début de la création d'un joueur à ${new Date().toLocaleTimeString()}`);
      const result = await this.joueursService.inscriptionJoueur(joueur);
      console.log(`Fin de la création d'un joueur à ${new Date().toLocaleTimeString()}`);
      return result;
    } catch (error) {
      console.log('Erreur lors de la création dun joueur');
      if (error instanceof PseudoPlayerAlreadyExists || error instanceof EmailPlayerAlreadyExists) {
        throw this.generateConflictException(error);
      }
      throw error;
    }
  }

  private generateConflictException(error: PseudoPlayerAlreadyExists | EmailPlayerAlreadyExists): HttpException {
    const errorMessage = error instanceof PseudoPlayerAlreadyExists
      ? "L'utilisateur existe déjà."
      : "L'adresse mail est déjà utilisée";
    return new HttpException(
      {
        status: HttpStatus.CONFLICT,
        error: errorMessage,
      },
      HttpStatus.CONFLICT,
    );
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