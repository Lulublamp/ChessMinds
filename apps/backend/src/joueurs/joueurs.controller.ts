import { Controller, Get, Param, ParseIntPipe, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { JoueurDto } from './DTO/joueurs.dto';
import { Post, Body } from '@nestjs/common';
import { JoueursService } from './joueurs.service';

@Controller('joueurs')
export class JoueursController {
  constructor(private readonly joueursService: JoueursService) {}

  //si on veut recupere des infos sur un joueur 
  @Get()
  async retrouverJoueur(@Param('joueur') joueur: JoueurDto){
    try {
      const joueurTrouve = await this.joueursService.findJoueur(joueur);
      return joueurTrouve;
    }catch (error){
      console.log("Le joueur n'existe pas")
      return error;
    }
  }

  //si on veut inscrire un joueur
  @Post('inscription')
  //permet de mettre un message d'erreur si une des infos du joueur qui est @noempty n'est pas remplie (fichier dto)
  @UsePipes(new ValidationPipe())
  inscriptionJoueur(@Body() joueur: JoueurDto) {
    try{
      return this.joueursService.inscriptionJoueur(joueur);
    }catch (error){
      console.log(error)
      return error;
    }
  }
//Pas sur de ca du tout a check
  @UsePipes(new ValidationPipe())
  createAdresse(@Body() joueur: JoueurDto) {
    try{
      const joueurInscrit = this.joueursService.createAdresse(joueur);
      return joueurInscrit;
    }
    catch (error){
      console.log(error)
      return error;
    }
  }
  
//si on veut modifier le pseudo ou le mot de passe d'un joueur
@Put('modifie')
  async modifierJoueur(@Body() joueurDto: JoueurDto) {
    try{
      return this.joueursService.modifierJoueur(joueurDto);
    }catch (error){
      console.log(error)
      return error;
    }
  }
  
}
