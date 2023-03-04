/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  joueursService: any;
  constructor(private jwtService: JwtService) {}

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];
  /*

  async validateUser(username: string, motDePasse: string): Promise<any> {
    const joueurDB = await this.joueursService.findJoueurBy(username);
    if (joueurDB) {
      const matched= await comparePassword(motDePasse, joueurDB.motDePasse);
      if(matched){
        console.log('Joueur valide avec succes');
        return joueurDB;
      }else{
        console.log('Joueur non valide');
        return null;
      }
    }else{
      console.log('Joueur non valide');
      return null;
    }
  }
  */

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.users.find((user) => user.username === username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
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
