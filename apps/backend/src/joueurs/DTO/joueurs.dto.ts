/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, IsInt } from 'class-validator';
import { Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class JoueurDto {

  @IsInt()
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