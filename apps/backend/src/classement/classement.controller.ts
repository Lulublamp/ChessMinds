import { Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import { ClassementService } from './classement.service';
import { ClassementDto } from './DTO/classement.dto';
import { Classement} from './entities/classement.entity';

@Controller('classement')
export class ClassementController {
  constructor(
    private readonly classementService: ClassementService) {}

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
//si on veut creer un classement
  @Post('creer')
  async creerClassement(@Body() classement: ClassementDto) {
    try {
      return await this.classementService.creerClassement(classement);
    } catch (error) {
      return error;
    }
  }

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

  @Put(':id')
  async updateClassement(@Param('id') id: number, @Body() classement: ClassementDto) {
    try {
      return await this.classementService.updateClassement(id, classement);
    } catch (error) {
      return error;
    }
  }


}
