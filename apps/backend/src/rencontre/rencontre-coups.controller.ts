import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Rencontre } from './entities/rencontre.entity';
import { Joueur } from 'src/joueurs/entities/joueur.entity';
import { Coups } from 'src/coups/entities/coups.entity';
import { RencontreCoupsService, RencontreWithPseudos } from './rencontre-coups.service';
import { JoueursService } from 'src/joueurs/joueurs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';

@Controller('rencontre-coups')
export class RencontreCoupsController {
  constructor(private readonly rencontreCoupsService: RencontreCoupsService
    , private readonly joueursService: JoueursService
    ) { }

  /*@Post('rencontre')
  async saveRencontre(@Body() rencontre: Partial<RencontreWithPseudos>): Promise<Rencontre> {
    return this.rencontreCoupsService.saveRencontre(rencontre);
  }*/

  /*@Post('coup')
  async saveCoup(@Body() coup: Partial<Coups>): Promise<Coups> {
    return this.rencontreCoupsService.saveCoup(coup);
  }*/

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Request() req): Promise<{ victoires: number; defaites: number; parties: number }> {
    return this.rencontreCoupsService.getStats(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('statsFriend/:idFriend')
  async getStatsFriend(@Request() req, @Param('idFriend') idFriend: number): Promise<{ victoires: number; defaites: number; parties: number }> {
      const friend = await this.joueursService.findJoueurById(idFriend);
      if(!friend) throw new Error('Joueur non trouvé');
      if(!this.joueursService.areFriends(req.user.id, idFriend)) throw new Error('Vous n\'êtes pas amis avec ce joueur');
      return this.rencontreCoupsService.getStats(friend.toDto());
  }  

  @UseGuards(JwtAuthGuard)
  @Get('getDetailsParties')
  async getPartiesDetailsPourJoueur(@Request() req): Promise<any> {
    return this.rencontreCoupsService.getPartiesDetailsPourJoueur(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getDetailsPartiesFriend/:idFriend')
  async getPartiesDetailsPourJoueurFriend(@Request() req, @Param('idFriend') idFriend: number): Promise<any> {
      const friend = await this.joueursService.findJoueurById(idFriend);
      if(!friend) throw new Error('Joueur non trouvé');
      if(!this.joueursService.areFriends(req.user.id, idFriend)) throw new Error('Vous n\'êtes pas amis avec ce joueur');
      return this.rencontreCoupsService.getPartiesDetailsPourJoueur(friend.toDto());
  }

  @Get(':idRencontre/coups')
  async getCoupsForRencontre(@Param('idRencontre') idRencontre: number): Promise<Coups[]> {
    return this.rencontreCoupsService.getCoupsForRencontre(idRencontre);
  }
}
