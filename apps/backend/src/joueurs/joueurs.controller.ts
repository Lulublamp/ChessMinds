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
  Query,
  Put,
  UnauthorizedException
} from '@nestjs/common';
import { JoueurDto } from './DTO/joueurs.dto';
import { JoueursService } from './joueurs.service';
import { Joueur } from './entities/joueur.entity';
import {
  PseudoPlayerAlreadyExists,
  EmailPlayerAlreadyExists,
  PlayerNotFound,
} from 'src/errors/bErrors';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';

@Controller('joueurs')
export class JoueursController {
  constructor(private readonly joueursService: JoueursService) { }

  @Post('inscription')
  async inscriptionJoueur(@Body() joueur: Joueur) {
    try {
      console.log(
        `Début de la création d'un joueur à ${new Date().toLocaleTimeString()}`,
      );
      const result = await this.joueursService.inscriptionJoueur(joueur);
      console.log(
        `Fin de la création d'un joueur à ${new Date().toLocaleTimeString()}`,
      );
      return result;
    } catch (error) {
      console.log('Erreur lors de la création dun joueur');
      if (
        error instanceof PseudoPlayerAlreadyExists ||
        error instanceof EmailPlayerAlreadyExists
      ) {
        throw this.generateConflictException(error);
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('friends/add')
  async addFriend(@Body() payload: { joueurId: number, friendId: number }, @Request() req) {
    try {
      if (req.user.idJoueur !== payload.joueurId) {
        throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
      }
      return await this.joueursService.addFriend(
        payload.joueurId,
        payload.friendId,
      );
    } catch (error) {
      throw new NotFoundException("Erreur lors de l'ajout de l'ami", error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('dateInscription')
  async getDateInscription(@Request() req): Promise<Date> {
    return this.joueursService.getDateInscription(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('TrouverJoueur')
  async trouverJoueur(@Query('pseudo') pseudo: string, @Query('email') email: string): Promise<number> {
    try {
      return (await this.joueursService.findJoueurByPseudo({ pseudo: pseudo })).idJoueur;
    }
    catch (error) {
      try {
        return (await this.joueursService.findJoueurByEmail({ adresseMail: email })).idJoueur;
      }
      catch (error) {
        throw new NotFoundException("Erreur lors de la recherche du joueur");
      }
    }
  }

  private generateConflictException(
    error: PseudoPlayerAlreadyExists | EmailPlayerAlreadyExists,
  ): HttpException {
    const errorMessage =
      error instanceof PseudoPlayerAlreadyExists
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

  @UseGuards(JwtAuthGuard)
  @Put('updatePseudo/:id')
  async updatePseudo(
    @Param('id') id: number,
    @Body('nouveauPseudo') nouveauPseudo: string,
  ): Promise<Joueur> {
    try {
      return await this.joueursService.updatePseudo(id, nouveauPseudo);
    } catch (error) {
      if (error instanceof PseudoPlayerAlreadyExists) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: "Le pseudo est déjà utilisé",
          },
          HttpStatus.CONFLICT,
        );
      } else if (error instanceof PlayerNotFound) {
        throw new NotFoundException("Erreur lors de la recherche du joueur");
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: "Erreur lors de la mise à jour du pseudo",
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateEmail/:id')
  async updateEmail(
    @Param('id') id: number,
    @Body('nouveauEmail') nouveauEmail: string,
  ): Promise<Joueur> {
    try {
      return await this.joueursService.updateEmail(id, nouveauEmail);
    } catch (error) {
      if (error instanceof EmailPlayerAlreadyExists) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: "L'adresse email est déjà utilisée",
          },
          HttpStatus.CONFLICT,
        );
      } else if (error instanceof PlayerNotFound) {
        throw new NotFoundException("Erreur lors de la recherche du joueur");
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: "Erreur lors de la mise à jour de l'email",
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateIcon/:id')
  async updateIconId(
    @Param('id') id: number,
    @Body('nouvelIconId') nouvelIconId: number,
  ): Promise<Joueur> {
    try {
      return await this.joueursService.updateIconId(id, nouvelIconId);
    } catch (error) {
      if (error instanceof PlayerNotFound) {
        throw new NotFoundException("Erreur lors de la recherche du joueur");
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: "Erreur lors de la mise à jour de l'id de l'icône",
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('PlayerDetails/:id')
  async getPlayerInfo(@Param('id') id: number): Promise<any> {
    try {
      return await this.joueursService.getPlayerDetails(id);
    } catch (error) {
      if (error instanceof PlayerNotFound) {
        throw new NotFoundException("Erreur lors de la recherche du joueur");
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: "Erreur lors de la récupération des informations du joueur",
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('friends/:friendId')
  async areFriends(@Request() req, @Param('friendId') friendId: number): Promise<boolean> {
    const joueurId = req.user.idJoueur;
    try {
      return await this.joueursService.areFriends(joueurId, friendId);
    } catch (error) {
      throw new NotFoundException("Erreur lors de la vérification de l'amitié", error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('Getfriends')
  async getFriends(@Request() req): Promise<number[]> {
    try {
      return await this.joueursService.getFriends(req.user.idJoueur);
    } catch (error) {
      throw new NotFoundException("Erreur lors de la récupération des amis", error);
    }
  }
}
