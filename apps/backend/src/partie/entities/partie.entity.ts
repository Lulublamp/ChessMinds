import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rencontre } from '../../rencontre/entities/rencontre.entity';

@Entity()
export class Partie {
  @PrimaryGeneratedColumn()
  idPartie: number;

  @OneToOne(() => Rencontre, {nullable:false})
  @JoinColumn()
  idRencontre: Rencontre;

  @CreateDateColumn()
  heureDebut: number;

  @CreateDateColumn()
  heureFin: number;

  @CreateDateColumn()
  dureePartie: number;

  @CreateDateColumn({nullable:false})
  datePartie: number;

}
