/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';


export class RencontreDTO {
  @IsNotEmpty()
  @IsNumber()
  joueurBlanc: number;

  @IsNotEmpty()
  @IsNumber()
  joueurNoir: number;

  @IsNotEmpty()
  @IsNumber()
  vainqueur: number;
}