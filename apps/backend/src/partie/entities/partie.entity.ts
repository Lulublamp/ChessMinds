import { CreateDateColumn, Entity, JoinColumn, OneToOne, Column} from "typeorm";
import { Rencontre } from "apps/backend/src/rencontre/entities/rencontre.entity";

@Entity()
export class Partie {

  @OneToOne(() => Rencontre, (rencontre) => rencontre.idRencontre)
  idRencontre: Rencontre[]

  @CreateDateColumn()
  heureDebut: number;

  @CreateDateColumn()
  heureFin: number;

  @CreateDateColumn()
  dureePartie: number;

  @Column()
  coups: string;
}