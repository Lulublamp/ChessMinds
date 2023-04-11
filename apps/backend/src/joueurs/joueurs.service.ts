import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { resolve } from 'path';
import {
  AlreadyFriends,
  NotFriends,
  PlayerAlreadyExists,
  PlayerNotCreated,
  PlayerNotFound,
} from 'src/errors/bErrors';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { JoueurDto } from './DTO/joueurs.dto';
import { Joueur } from './entities/joueur.entity';

@Injectable()
export class JoueursService {
 
  constructor(
    @InjectRepository(Joueur)
    private readonly joueursRepository: Repository<Joueur>,
  ) {}

  async inscriptionJoueur(joueurDto: JoueurDto): Promise<Joueur> {
    try {
      const newJoueur = this.joueursRepository.create(joueurDto);
      return await this.joueursRepository.save(newJoueur);
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new PlayerAlreadyExists();
      }
      throw new PlayerNotCreated();
    }
  }

  async findJoueurByEmail(
    email: Pick<JoueurDto, 'adresseMail'>,
  ): Promise<Joueur> {
    const joueurTrouve = await this.joueursRepository.findOne({
      where: {
        adresseMail: email.adresseMail,
      },
    });
    if (!joueurTrouve) {
      throw new PlayerNotFound();
    }
    return joueurTrouve;
  }

  async findJoueurByFullPseudo(
    query: Pick<Joueur, 'fullpseudo'>,
  ): Promise<Joueur> {
    const joueurTrouve = await this.joueursRepository.findOne({
      where: {
        fullpseudo: query.fullpseudo,
      },
    });
    if (!joueurTrouve) {
      throw new PlayerNotFound();
    }
    return joueurTrouve;
  }

  async findJoueurByPseudo(query: Pick<Joueur, 'pseudo'>): Promise<Joueur> {
    const joueurTrouve = await this.joueursRepository.findOne({
      where: {
        pseudo: query.pseudo,
      },
    });
    if (!joueurTrouve) {
      throw new PlayerNotFound();
    }
    return joueurTrouve;
  }

  async addFriend(email: string, fullpseudo: string) {
    const joueur = await this.findJoueurByEmail({ adresseMail: email });
    //if(!joueur) throw new PlayerNotFound();
    const maybeFriend = await this.findJoueurByFullPseudo({
      fullpseudo: fullpseudo,
    });
    //if(!maybeFriend) throw new PlayerNotFound();

    if(joueur.idJoueur === maybeFriend.idJoueur) throw new NotFriends();
    
    console.log(joueur.amis);

    if (!joueur.amis) {
      joueur.amis = [];
    }

    if (!maybeFriend.amis) {
      maybeFriend.amis = [];
    }

    if (joueur.amis.includes(maybeFriend)) throw new AlreadyFriends();

    console.log(joueur.amis);

    joueur.amis.push(maybeFriend);
    maybeFriend.amis.push(joueur);
    try {
      await this.joueursRepository.save(joueur);
      await this.joueursRepository.save(maybeFriend);

      console.log('Friend added');
    } catch (error) {
      console.log(error);
      throw new NotFriends();
    }
  }

  async getFriends(joueur: Pick<Joueur, "fullpseudo" >) {
    const joueurTrouve = await this.joueursRepository.findOne({
      where: {
        fullpseudo: joueur.fullpseudo,
      },
      relations: ['amis'],
    });
    if (!joueurTrouve) {
      throw new PlayerNotFound();
    }
    return joueurTrouve;
  }

  async getInscriptionDate(joueur: Pick<Joueur, "fullpseudo" >) {
    const joueurD= await this.joueursRepository.findOne({
      where: {
        fullpseudo: joueur.fullpseudo,
        },
      select: ['dateInscription'],
    });
    if (!joueurD) {
      throw new PlayerNotFound();
    }
    return joueurD;
  }
  
  //A voir si c'est utile POUR return le pseudo selon adresse amil
  async getFullPseudo(email: Pick<JoueurDto, 'adresseMail'>): Promise<string> {
    const joueur = await this.findJoueurByEmail(email);
    if(!joueur) throw new PlayerNotFound();
    return joueur.fullpseudo;
  }

}
