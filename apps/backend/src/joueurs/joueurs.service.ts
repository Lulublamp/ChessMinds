import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { Repository } from 'typeorm';
import { JoueurDto } from './DTO/joueurs.dto';
import { Joueur } from './entities/joueur.entity';

@Injectable()
export class JoueursService {
  //injecter le repository de la table joueur
  constructor(
    @InjectRepository(Joueur)
    private readonly joueursRepository: Repository<Joueur>,
  ) {}
  //retrouver un joueur avec le Repository
  async findJoueur(idJoueur: number) {
    return await this.joueursRepository.find();
  }
  //enregistrer un joueur avec le Repository
  inscriptionJoueur(joueur: JoueurDto) {
    const joueurInscrit = this.joueursRepository.create(joueur);
    return this.joueursRepository.save(joueurInscrit);
  }
}
