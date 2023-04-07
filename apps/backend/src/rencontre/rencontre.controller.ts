import { Controller, Get, Param } from '@nestjs/common';
import { RencontreService } from './rencontre.service';
import { Rencontre } from './entities/rencontre.entity';
import { RencontreDTO } from './DTO/rencontre.dto';
import { Post, Body } from '@nestjs/common';

@Controller('rencontre')
export class RencontreController {
  constructor(private readonly rencontreService: RencontreService) {}

//recuperer le nombre de rencontre d'un joueur
  @Get('nombre/:joueur')
  async nombreRencontre(@Param('joueur') joueur: Pick<RencontreDTO, 'joueurBlanc' | 'joueurNoir'>) {
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
  async nombreVictoire(@Param('joueur') joueur: Pick<RencontreDTO, 'joueurBlanc' | 'joueurNoir'>) {
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
  async nombreDefaite(@Param('joueur') joueur: Pick<RencontreDTO, 'joueurBlanc' | 'joueurNoir'>) {
    try {
      const nombreDefaite = await this.rencontreService.nombreDefaite(joueur);
      return nombreDefaite;
    } catch (error) {
      console.log("Le joueur n'existe pas");
      return error;
    }
  }


}
