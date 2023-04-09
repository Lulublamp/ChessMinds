import { Controller, Get, Param } from '@nestjs/common';
import { RencontreService } from './rencontre.service';
import { Rencontre } from './entities/rencontre.entity';
import { RencontreDTO } from './DTO/rencontre.dto';
import { Post, Body } from '@nestjs/common';
import { Joueur } from 'src/joueurs/entities/joueur.entity';

@Controller('rencontre')
export class RencontreController {
  constructor(private readonly rencontreService: RencontreService) {}

//recuperer le nombre de rencontre d'un joueur
  @Get('nombre/:joueur')
  async nombreRencontre(@Param('joueur') joueur: Pick<Joueur,'fullpseudo'>) {
    try {
      const nombreRencontre = await this.rencontreService.nombreRencontre(joueur);
      return nombreRencontre;
    } catch (error) {
      console.log("Le joueur n'existe pas");
      return error;
    }
  }

//recuperer le nombre de victoire d'un joueur
  @Get('victoire/:joueur')
  async nombreVictoire(@Param('joueur') joueur: Pick<Joueur, 'fullpseudo' | 'idJoueur'>) {
    try {
      const nombreVictoire = await this.rencontreService.nombreVictoire(joueur);
      return nombreVictoire;
    } catch (error) {
      console.log("Le joueur n'existe pas");
      return error;
    }
  }

  //recuperer le nombre de défaite
  @Get('defaite/:joueur')
  async nombreDefaite(@Param('joueur') joueur: Pick<Joueur, 'fullpseudo' | 'idJoueur'>) {
    try {
      const nombreDefaite = await this.rencontreService.nombreDefaite(joueur);
      return nombreDefaite;
    } catch (error) {
      console.log("Le joueur n'existe pas");
      return error;
    }
  }

  //recuperer le nombre de nul
  @Get('nul/:joueur')
  async nombreNul(@Param('joueur') joueur: Pick<Joueur, 'fullpseudo'>) {
    try {
      const nombreNul = await this.rencontreService.nombreNul(joueur);
      return nombreNul;
    } catch (error) {
      console.log("Le joueur n'existe pas");
      return error;
    }
  }

  //recuperer toute les rencontres d'un joueur PAS SUR
  @Get('rencontre/:joueur')
  async toutesRencontres(@Param('joueur') joueur: Pick<Joueur, 'fullpseudo'>) {
    try {
      const toutesRencontres = await this.rencontreService.toutesRencontres(joueur);
      return toutesRencontres;
    } catch (error) {
      console.log("Le joueur n'existe pas");
      return error;
    }
  }

  //PAS SUR
  @Get('date/:joueur')
  async dateRencontre(@Param('joueur') joueur: Pick<Joueur, 'fullpseudo'>) {
    try {
      const dateRencontre = await this.rencontreService.dateRencontre(joueur);
      return dateRencontre;
    } catch (error) {
      console.log("Le joueur n'existe pas");
      return error;
    }
  }


}
