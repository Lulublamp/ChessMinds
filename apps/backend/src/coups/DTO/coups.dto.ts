import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Piece, Echiquier, Couleur } from '../entities/coups.entity';

export class CreateCoupDto {
  @IsNotEmpty()
  @IsNumber()
  idRencontre: number;

  @IsNotEmpty()
  @IsEnum(Echiquier)
  caseSource: Echiquier;

  @IsNotEmpty()
  @IsEnum(Echiquier)
  caseDestination: Echiquier;

  @IsNotEmpty()
  @IsEnum(Piece)
  piece: Piece;

  @IsNotEmpty()
  @IsEnum(Couleur)
  couleur: Couleur;
}
