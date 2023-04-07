import { Body, Controller, Get, Param, Post, Put,Patch} from '@nestjs/common';
import { ClassementService } from './classement.service';
import { ClassementDto } from './DTO/classement.dto';
import { Classement, TypePartie} from './entities/classement.entity';

@Controller('classement')
export class ClassementController {
  constructor(private readonly classementService: ClassementService) {}

//si on veut recupere classement
  @Get('chercher/:id')
  async retrouverClassement(@Param('id') id: Pick<Classement, 'idClassement'>) {
    try {
      const classementTrouve = this.classementService.findClassement(id);
      return classementTrouve;
    } catch (error) {
      console.log("Le classement n'existe pas");
      return error;
    }
  }
//Recupere le classement d'un joueur
  @Get('joueur/:id')
  async retrouverJoueur(@Param('idJoueur') idJoueur: Pick<ClassementDto, 'idJoueur'>) {
    try{
      const trouverJoueur = await this.classementService.findJoueur(idJoueur);
      return trouverJoueur;
    }catch(error){
      console.log("Le joueur n'existe pas");
      return error;
    }
  }

//Recupere le classement selon le type de partie
  @Get('typePartie/:typePartie')
  async retrouverParTypePartie(@Param('type') type: string) {
    try{
      const trouverType = await this.classementService.findByType(type);
      return trouverType;
    }catch(error){
      console.log("Le type n'existe pas");
      return error;
    }
  }


//Mettre a jour le classement
  @Put(':idClassement/:typePartie/:elo')
  async updateClassement(
    @Param('id') id: Pick<Classement, 'idClassement'>,
    @Param('typePartie') typePartie: TypePartie,
    @Param('elo') elo: number,) {
    try {
      return await this.classementService.updateELO(id,typePartie, elo);
    } catch (error) {
      return error;
    }
  }

  //ANCIEN EXEMPLE POUR COMPARER
  /*@Patch(':id/:elo/:typePartie')
  async miseAjourELO(
    @Param('id') id: Pick<Classement, 'idClassement'>,
    @Param('typePartie') typePartie: string,
    @Body() updatePlayerDto: ClassementDto)
    {

      /*const classement=this.retrouverClassement(id);
      //recupere le ELO actuel du joueur
      const ELOActuel = classement[typePartie];

      //VOIR COMMENT RÉCUPERER NOUVEAU ELO APRES LES CALCULS
      //recupere le ELO du joueur qui a gagne
      const newELO= updatePlayerDto[typePartie];
      
      //met a jour le ELO du joueur
      classement[typePartie] = newELO;
      this.classementService.updateClassement(id,await classement);
      

      return classement;

  
    }*/


    
}
