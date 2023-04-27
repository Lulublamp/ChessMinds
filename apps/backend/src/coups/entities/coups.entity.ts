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
  d1 = 41, d2 = 42, d3 = 43, d4 = 44, d5 = 45, d6 = 46, d7 = 47, d8 = 48,
  e1 = 51, e2 = 52, e3 = 53, e4 = 54, e5 = 55, e6 = 56, e7 = 57, e8 = 58,
  f1 = 61, f2 = 62, f3 = 63, f4 = 64, f5 = 65, f6 = 66, f7 = 67, f8 = 68,
  g1 = 71, g2 = 72, g3 = 73, g4 = 74, g5 = 75, g6 = 76, g7 = 77, g8 = 78,
  h1 = 81, h2 = 82, h3 = 83, h4 = 84, h5 = 85, h6 = 86, h7 = 87, h8 = 88,
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

  @Column({ nullable: false })
  ordre: number;
}
