/* eslint-disable prettier/prettier */
import { IsNotEmpty} from 'class-validator';

export class ClassementDtoBlitz {
  // a voir si on a besoin de l'idJoueur dans le DTO
  // Mais je pense que oui sinon on ne sait pas à qui on attribue le chanegemnt de ELO
  @IsNotEmpty()
  idJoueur: number;

  @IsNotEmpty()
  ELO: number;

 /* @IsNotEmpty()
  ELOMax: number;*/
}