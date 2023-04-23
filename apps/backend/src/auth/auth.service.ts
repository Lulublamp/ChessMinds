/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Classement } from 'src/classement/entities/classement.entity';
import { Joueur } from 'src/joueurs/entities/joueur.entity';
import { JoueursService } from 'src/joueurs/joueurs.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private joueurService: JoueursService,
    private readonly entityManager: EntityManager,
  ) {}

  private readonly users = [];

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.users.find((user) => user.username === username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(joueur: Joueur) {
    const payload = {
      idJoueur: String(joueur.idJoueur),
      email: joueur.adresseMail,
      username: joueur.pseudo,
    };
    console.log('payload', payload);
    return {
      access_token: this.jwtService.sign(payload),
      adresseMail: joueur.adresseMail,
      pseudo: joueur.pseudo,
      idJoueur: joueur.idJoueur,
    };
  }

  async validateToken(token: string): Promise<any> {
    const payload = this.jwtService.verify(token);
    if (payload) {
      const user = await this.joueurService.findJoueurByEmail({
        adresseMail: payload.email,
      });

      if (!user) {
        return null;
      }

      const classement = await this.entityManager
        .createQueryBuilder(Classement, 'classement')
        .where('classement.user_id = :userId', { userId: user.idJoueur })
        .getOne();
      for (const key in classement) {
        if (Object.prototype.hasOwnProperty.call(classement, key)) {
          classement[key] = Number(classement[key]);
        }
      }
      return {
        user: user,
        classement: classement,
      };
    }
    return null;
  }
}
