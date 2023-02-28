import { Controller } from '@nestjs/common';
import { JoueurDto } from './DTO/joueurs.dto';
import { Post, Body } from '@nestjs/common';
import { JoueursService } from './joueurs.service';

@Controller('joueurs')
export class JoueursController {
  constructor(
    private readonly joueursService: JoueursService,
  ) {}

  @Post('inscription')
  inscriptionJoueur(@Body() joueur: JoueurDto) {
    try {
      const joueurInscrit = this.joueursService.inscriptionJoueur(joueur);
    } catch (error) {
      
    }
  }
  

}
