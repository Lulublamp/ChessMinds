/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JoueurDto {
  @IsNotEmpty()
  @IsEmail() // pour dire que ce qui entre en email doit etre sous forme d'email
  adresseMail: string;

  pseudo?: string;

  @IsNotEmpty()
  @IsString()
  motDePasse: string;
}