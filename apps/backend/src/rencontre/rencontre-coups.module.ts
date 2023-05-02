import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rencontre } from './entities/rencontre.entity';
import { Coups } from 'src/coups/entities/coups.entity';
import { RencontreCoupsService } from './rencontre-coups.service';
import { RencontreCoupsController } from './rencontre-coups.controller';
import { JoueursModule } from 'src/joueurs/joueurs.module';
import { PartieModule } from 'src/partie/partie.module';
import { Partie } from 'src/partie/entities/partie.entity';
import { ClassementModule } from 'src/classement/classement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rencontre, Coups, Partie]),
    JoueursModule,
    PartieModule,
    ClassementModule,
  ],
  providers: [RencontreCoupsService],
  controllers: [RencontreCoupsController],
  exports: [RencontreCoupsService],
})
export class RencontreCoupsModule {}
