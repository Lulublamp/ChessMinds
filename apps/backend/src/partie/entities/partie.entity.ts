/* eslint-disable prettier/prettier */
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

  @CreateDateColumn({nullable:false})
  heureDebut: number;

  @CreateDateColumn({nullable:false})
  heureFin: number;

  @CreateDateColumn({nullable:false})
  dureePartie: number;

}
