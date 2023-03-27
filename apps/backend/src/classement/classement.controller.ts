import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ClassementService } from './classement.service';
import { ClassementDto } from './DTO/classement.dto';

@Controller('classement')
export class ClassementController {
  constructor(private readonly classementService: ClassementService) {}

  //si on veut recupere classement
  @Get()
  async retourneClassement(@Body() classement: ClassementDto) {
    //  const classements= await this.classementService.findClassement();
    //return classements;
  }

  //si on veut modifier le classement
  /* @Put('update')
  updateClassement(
    @Param('idJoueur', ParseIntPipe) idJoeur: number,
    @Body() classement: ClassementDto
  ) {
    try {
      const classementUpdate = this.classementService.updateClassement(idJoeur,classement);
      return classementUpdate;
    }catch (error){
      console.log(error)
      return error;
    }
  }*/
}
