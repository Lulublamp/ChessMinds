/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Joueur } from 'src/joueurs/entities/joueur.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

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
    const payload = { idJoueur: joueur.idJoueur, email: joueur.adresseMail, username: joueur.pseudo };
    return {
      access_token: this.jwtService.sign(payload),
      adresseMail: joueur.adresseMail,
      pseudo: joueur.pseudo,
    };
  }

  async validateToken(token: string): Promise<any> {
    const payload = this.jwtService.verify(token);
    if (payload.sub) {
      const player = await this.users.find(
        (user) => user.userId === payload.sub,
      );
      return player;
    }
    return null;
  }
}
