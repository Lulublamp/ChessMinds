import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { JoueurDto } from './DTO/joueurs.dto';
import { Post, Body } from '@nestjs/common';
import { JoueursService } from './joueurs.service';
import { Joueur } from './entities/joueur.entity';

@Controller('joueurs')
export class JoueursController {
  constructor(private readonly joueursService: JoueursService) {}

  //si on veut recupere des infos sur un joueur
  @Get('cherche/:joueur')
  async retrouverJoueur(@Param('email') email: Pick<JoueurDto, 'adresseMail'>) {
    try {
      const joueurTrouve = await this.joueursService.findJoueurByEmail(email);
      return joueurTrouve;
    } catch (error) {
      console.log("Le joueur n'existe pas");
      return error;
    }
  }

  @Get('cherche/:email')
  async retrouverMail(@Param('email') email: Pick<JoueurDto, 'adresseMail'>){
    try{
      const mailTrouver= await this.joueursService.findJoueurByEmail(email);
      return true;
    }catch(error){
      console.log("Le mail n'existe pas");
      return false;
    }
  }

  //DOUTE AVEC FULLPSEUDO ET PSEUDO
  @Get('cherche/:pseudo')
  async retrouverByPseudo(@Param('pseudo') pseudo: Pick<Joueur, 'fullpseudo'>){
    try{
      const pseudoTrouver= await this.joueursService.findJoueurByFullPseudo(pseudo);
      return true;
    }catch(error){
      console.log("Le pseudo n'existe pas");
      return false;
    }
  }
  
  //si on veut inscrire un joueur
  //permet de mettre un message d'erreur si une des infos du joueur qui est @noempty n'est pas remplie (fichier dto)
  @Post('inscription')
  async inscriptionJoueur(@Body() joueur: JoueurDto) {
    try {
      return await this.joueursService.inscriptionJoueur(joueur);
    } catch (error) {
      return error;
    }
  }

  @Post('friends/add')
  async addFriend(@Body() payload: Pick<Joueur, 'adresseMail' | 'fullpseudo'>) {
    try {
      console.log(payload);
      return await this.joueursService.addFriend(
        payload.adresseMail,
        payload.fullpseudo,
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('pseudo')
  async retrouverPseudo(@Param('adresse') adresse: Pick<JoueurDto, 'adresseMail'>) {
    try {
      const pseudoTrouve = await this.joueursService.getFullPseudo(adresse);
      return pseudoTrouve;
    } catch (error) {
      console.log("Le pseudo n'existe pas");
      return error;
    }
  }
}