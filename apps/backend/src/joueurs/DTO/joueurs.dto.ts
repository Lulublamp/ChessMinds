/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JoueurDto {
  @IsNotEmpty()
  @IsEmail()
  adresseMail: string;

  pseudo?: string;

  @IsNotEmpty()
  @IsString()
  motDePasse: string;
}