import { Body, Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { ClassementBlitzService } from './classement_blitz.service';
import { ClassementBlitzDto } from './DTO/classementBlitz.dto';

@Controller('classement-blitz')
export class ClassementBlitzController {
  constructor(
    private readonly classementBlitzService: ClassementBlitzService) {}

//si on veut recupere classement
  @Get(':mode')
  async findClassement(@Param('mode') mode: 'asc' | 'desc') {
    return await this.classementBlitzService.findClassement(mode);
  }

//si on veut modifier le classement
  @Put('update')
  updateClassement(
    @Param('idJoueur', ParseIntPipe) idJoeur: number,
    @Body() classementBlitz: ClassementBlitzDto
  ): any {
    try {
      const classementBlitzUpdate = this.classementBlitzService.updateClassement(idJoeur,classementBlitz);
      return classementBlitzUpdate;
    }catch (error){
      console.log(error)
      return error;
    }
  }
}
