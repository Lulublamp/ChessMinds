import { IsNotEmpty} from 'class-validator';
import { Joueur } from 'src/joueurs/entities/joueur.entity';

export class ClassementDto {
  idClassement?: number;
  user_id: Joueur;
  elo_blitz: number;
  elo_bullet: number;
  elo_rapide: number;
  elo_max_blitz: number;
  elo_max_bullet: number;
  elo_max_rapide: number;
}



