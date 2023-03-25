/* eslint-disable prettier/prettier */
import { IsNotEmpty} from 'class-validator';

export class ClassementDto {
  // a voir si on a besoin de l'idJoueur dans le DTO
  // Mais je pense que oui sinon on ne sait pas à qui on attribue le chanegemnt de ELO
  
  @IsNotEmpty()
  idJoueur: number;

  @IsNotEmpty()
  ELORapide: number;

  @IsNotEmpty()
  ELOBLitz: number;

  @IsNotEmpty()
  ELOBullet: number;

 /* @IsNotEmpty()
  ELOMax: number;*/
}



