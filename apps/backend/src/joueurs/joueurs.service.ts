import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { resolve } from 'path';
import {
  AlreadyFriends,
  EmailPlayerAlreadyExists,
  PseudoPlayerAlreadyExists,
  PlayerNotCreated,
  PlayerNotFound,
} from 'src/errors/bErrors';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { JoueurDto } from './DTO/joueurs.dto';
import { Joueur } from './entities/joueur.entity';
import { ClassementService } from 'src/classement/classement.service';

@Injectable()
export class JoueursService {
  constructor(
    @InjectRepository(Joueur)
    private readonly joueursRepository: Repository<Joueur>,
    private readonly classementService: ClassementService,
  ) {}

  async inscriptionJoueur(joueur: Joueur): Promise<Joueur> {
    const existingJoueurByEmail = await this.joueursRepository.findOne({
      where: { adresseMail: joueur.adresseMail },
    });
    const existingJoueurByPseudo = await this.joueursRepository.findOne({
      where: { pseudo: joueur.pseudo },
    });
    if(existingJoueurByEmail){
      throw new EmailPlayerAlreadyExists();
    }
    if(existingJoueurByPseudo){
      throw new PseudoPlayerAlreadyExists();
    }

    try {
      joueur.motDePasse = await hashPassword(joueur.motDePasse);
      const newJoueur = this.joueursRepository.create(joueur);
      const joueurCree = await this.joueursRepository.save(newJoueur);
  
      await this.classementService.creerClassement({
        user_id: joueurCree,
        elo_blitz: 800,
        elo_bullet: 800,
        elo_rapide: 800,
        elo_max_blitz: 800,
        elo_max_bullet: 800,
        elo_max_rapide: 800,
      });
  
      return joueurCree;
    } catch (error) {
      throw new PlayerNotCreated();
    }
  }
  
  async connexionJoueur(adresseMail: string, motDePasse: string): Promise<Joueur | null> {
    const joueur = await this.joueursRepository.findOne({ 
      where: { adresseMail: adresseMail }
     });

    if (!joueur || !(comparePassword(motDePasse, joueur.motDePasse))) {
      return null;
    }

    return joueur;
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
    query: Pick<Joueur, 'pseudo'>,
  ): Promise<Joueur> {
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

  async addFriend(email: string, pseudo: string) {
    const joueur = await this.findJoueurByEmail({ adresseMail: email });
    const maybeFriend = await this.findJoueurByFullPseudo({
      pseudo: pseudo,
    });

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
      throw new Error('Could not add friend');
    }
  }

  async getDateInscription(joueur: Joueur): Promise<Date> {
    const joueurTrouve = await this.joueursRepository.findOne({ where: { idJoueur: joueur.idJoueur } });
    if (!joueurTrouve) {
      throw new Error('Joueur introuvable');
    }
    return joueurTrouve.dateInscription;
  }

}
