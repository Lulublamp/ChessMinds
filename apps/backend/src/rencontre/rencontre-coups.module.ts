import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rencontre } from './entities/rencontre.entity';
import { Coups } from 'src/coups/entities/coups.entity';
import { RencontreCoupsService } from './rencontre-coups.service';
import { RencontreCoupsController } from './rencontre-coups.controller';
import { JoueursModule } from 'src/joueurs/joueurs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rencontre, Coups]),
    JoueursModule
  ],
  providers: [RencontreCoupsService],
  controllers: [RencontreCoupsController],
})
export class RencontreCoupsModule {}
