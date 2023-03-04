/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Unique } from 'typeorm';



export class JoueurDto {
  @Unique(['adresseMail'])
  @IsNotEmpty()
  @IsEmail() // pour dire que ce qui entre en email doit etre sous forme d'email
  adresseMail: string;

  pseudo?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[_])[A-Za-z\d_]{8,}$/, {
    message: 'Mot de passe trop faible',
  })
  motDePasse: string;
}