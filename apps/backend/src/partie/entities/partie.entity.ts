/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rencontre } from 'src/rencontre/entities/rencontre.entity';

@Entity()
export class Partie {
  @PrimaryGeneratedColumn()
  idPartie: number;

  @OneToOne(() => Rencontre, rencontre => rencontre.partie)
  @JoinColumn()
  rencontre: Rencontre;

  @CreateDateColumn({nullable:false})
  datePartie: Date;

  @Column({nullable:false})
  eloBlanc: number;

  @Column({nullable:false})
  eloNoir: number;

  
}
