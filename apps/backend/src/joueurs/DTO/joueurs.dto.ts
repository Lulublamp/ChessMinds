/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class JoueurDto {
  @IsNotEmpty()
  @IsEmail()
  adresseMail: string;

  @IsNotEmpty()
  @IsString()
  pseudo: string;

  @IsNotEmpty()
  @MinLength(6)
  motDePasse: string;

  async compareMotDePasse(motDePasse: string): Promise<boolean> {
    return await bcrypt.compare(motDePasse, this.motDePasse);
  }
}