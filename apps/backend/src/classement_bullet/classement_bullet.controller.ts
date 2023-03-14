import { Body, Controller, Get,Put, Param,ParseIntPipe } from '@nestjs/common';
import { ClassementBulletService } from './classement_bullet.service';
import { ClassementBulletDto } from './DTO/classementBullet.dto';

@Controller('classement-bullet')
export class ClassementBulletController {
  
  constructor(
    private readonly classementBulletService: ClassementBulletService) {}
  
  //si on veut recupere classement
  @Get(':mode')
  async findClassement(@Param('mode') mode: 'asc' | 'desc'){
      return await this.classementBulletService.findClassement(mode);
  }
  
  //si on veut modifier le classement
  @Put('update')
  updateClassement(
    @Param('idJoueur', ParseIntPipe) idJoeur: number,
    @Body() classementBullet: ClassementBulletDto
  ): any {
    try {
      const classementBulletUpdate = this.classementBulletService.updateClassement(idJoeur,classementBullet);
      return classementBulletUpdate;
    }catch (error){
      console.log(error)
      return error;
    }
  }
}