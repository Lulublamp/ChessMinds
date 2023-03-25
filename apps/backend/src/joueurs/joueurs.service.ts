
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { resolve } from 'path';
import {
  AlreadyFriends,
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
    console.log(error.name);
    if (error.name === 'QueryFailedError') {
      throw new PlayerAlreadyExists();
    }

    throw new PlayerNotCreated();
  }
}

async findJoueurByEmail(email: Pick<JoueurDto, 'adresseMail'>): Promise<Joueur> {
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


async findJoueurByPseudo(query: Pick<Joueur, 'fullpseudo'>): Promise<Joueur> {
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

async addFriend(email: string, fullpseudo: string) {
  const joueur = await this.findJoueurByEmail({ adresseMail: email });
  const maybeFriend = await this.findJoueurByPseudo({
    fullpseudo: fullpseudo,
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
}
