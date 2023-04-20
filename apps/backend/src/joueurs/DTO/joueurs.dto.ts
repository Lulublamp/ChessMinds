/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, IsNumber } from 'class-validator';
import * as bcrypt from 'bcrypt';

export class JoueurDto {

  @IsNumber()
  @IsNotEmpty()
  idJoueur?: number;

  @IsNotEmpty()
  @IsEmail()
  adresseMail: string;

  @IsNotEmpty()
  @IsString()
  pseudo: string;

  @IsNotEmpty()
  @MinLength(6)
  motDePasse: string;

  @IsNotEmpty()
  dateInscription: Date;

  async compareMotDePasse(motDePasse: string): Promise<boolean> {
    return await bcrypt.compare(motDePasse, this.motDePasse);
  }
}