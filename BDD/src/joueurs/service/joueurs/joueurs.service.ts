import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateJoueursParam } from 'src/joueurs/dtos/CreateJoueurs.dto';
import { Joueurs } from 'src/typeorm/entities/Joueurs';
import { Repository } from 'typeorm';

@Injectable()
export class JoueursService {

    //react with database
    constructor(
        @InjectRepository(Joueurs) private joueursRepository: Repository<Joueurs>, )
        {}

    findJoueurs(){}

    createJoueur(userDetails: CreateJoueursParam){
        const newJoeur = this.joueursRepository.create({
            ...userDetails});
        return this.joueursRepository.save(newJoeur);
    }  
}
