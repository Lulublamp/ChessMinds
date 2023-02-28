/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class JoueurDto {
  @IsNotEmpty()
  joueurBlanc: string;

  @IsNotEmpty()
  joueurNoir: string;

  @IsNotEmpty()
  @IsString()
  vainqueur: string;
}