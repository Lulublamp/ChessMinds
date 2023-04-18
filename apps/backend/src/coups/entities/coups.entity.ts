import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToOne,
  
} from 'typeorm';
import { Rencontre } from '../../rencontre/entities/rencontre.entity';

export enum Piece {
  PION = 'PION',
  CAVALIER = 'CAVALIER',
  FOU = 'FOU',
  TOUR = 'TOUR',
  DAME = 'DAME',
  ROI = 'ROI',
}

export enum Echiquier {
  a1 = 11, a2 =12,  a3 = 13, a4 = 14, a5 = 15, a6 = 16, a7 = 17, a8 = 18,
  b1 = 21, b2 = 22, b3 = 23, b4 = 24, b5 = 25, b6 = 26, b7 = 27, b8 = 28,
  c1 = 31, c2 = 32, c3 = 33, c4 = 34, c5 = 35, c6 = 36, c7 = 37, c8 = 38,
  D1 = 41, D2 = 42, D3 = 43, D4 = 44, D5 = 45, D6 = 46, D7 = 47, D8 = 48,
  E1 = 51, E2 = 52, E3 = 53, e4 = 54, E5 = 55, E6 = 56, E7 = 57, E8 = 58,
  F1 = 61, F2 = 62, F3 = 63, F4 = 64, F5 = 65, F6 = 66, F7 = 67, F8 = 68,
  G1 = 71, G2 = 72, G3 = 73, G4 = 74, G5 = 75, G6 = 76, G7 = 77, G8 = 78,
  H1 = 81, H2 = 82, H3 = 83, H4 = 84, H5 = 85, H6 = 86, H7 = 87, H8 = 88,
}

export enum Couleur {
  BLANC = 'BLANC',
  NOIR = 'NOIR',
}

@Entity()
export class Coups {
  @PrimaryGeneratedColumn()
  idCoup: number;

  @ManyToOne(() => Rencontre)
  idRencontre: Rencontre;

  @Column({type:'enum', enum: Echiquier})
  caseSource: Echiquier;

  @Column({type:'enum', enum: Echiquier, nullable: false})
  caseDestination: Echiquier;

  @Column({ nullable: false })
  piece: Piece;

  @Column({type: 'enum', enum: Couleur, nullable: false})
  couleur: Couleur;
}
