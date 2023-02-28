/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JoueurDto {
  @IsNotEmpty()
  @IsEmail()
  adresseMail: string;

  @IsNotEmpty()
  @IsString()
  pseudo: string;

  @IsNotEmpty()
  @IsString()
  tagJoueur: string;

  @IsNotEmpty()
  @IsString()
  loginJoueur: string;

  @IsNotEmpty()
  @IsString()
  motDePasse: string;

  dateInscription: Date;
}