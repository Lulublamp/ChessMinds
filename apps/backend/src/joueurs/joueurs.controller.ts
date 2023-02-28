import { Controller, Get } from '@nestjs/common';
import { JoueurDto } from './DTO/joueurs.dto';
import { Post, Body } from '@nestjs/common';
import { JoueursService } from './joueurs.service';

@Controller('joueurs')
export class JoueursController {
  constructor(
    private readonly joueursService: JoueursService) {}

    //si on veut recupere des infos sur un joueur 
  @Get()
  async retourneJoueur(@Body() joueur: JoueurDto) {
    //const joueurs= await this.joueursService.findJoueur();
    //return joueurs;
  }

  @Post('inscription')
  inscriptionJoueur(@Body() joueur: JoueurDto) {
    try {
      const joueurInscrit = this.joueursService.inscriptionJoueur(joueur);
      return joueurInscrit;
    } catch (error) {
      console.log(error)
      return error;
    }
  }
  

}
