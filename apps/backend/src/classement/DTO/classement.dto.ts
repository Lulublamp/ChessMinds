import { IsNotEmpty, IsInt, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Joueur } from 'src/joueurs/entities/joueur.entity';

export class ClassementDto {
  @IsInt()
  @IsNotEmpty()
  idClassement?: number;

  @ValidateNested()
  @Type(() => Joueur)
  @IsNotEmpty()
  user_id: Joueur;

  @IsNumber()
  @Min(0)
  elo_blitz: number;

  @IsNumber()
  @Min(0)
  elo_bullet: number;

  @IsNumber()
  @Min(0)
  elo_rapide: number;

  @IsNumber()
  @Min(0)
  elo_max_blitz: number;

  @IsNumber()
  @Min(0)
  elo_max_bullet: number;

  @IsNumber()
  @Min(0)
  elo_max_rapide: number;
}
