import { Controller, Get, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CreateJoueursParam} from 'src/joueurs/dtos/CreateJoueurs.dto';
import { JoueursService } from 'src/joueurs/service/joueurs/joueurs.service';
import { Joueurs } from 'src/typeorm/entities/Joueurs';
@Controller('joueurs')
export class JoueursController {

    constructor(private joueursService: JoueursService){}
    @Get()
    getCustomRepositoryToken(){}


    @Post()
    createJoueur(@Body() createJoueurDto:CreateJoueursParam){
            this.joueursService.createJoueur(createJoueurDto);
        }
}

  

