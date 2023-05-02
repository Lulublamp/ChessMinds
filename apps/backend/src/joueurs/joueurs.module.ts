import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Joueur } from './entities/joueur.entity';
import { JoueurSubscriber } from './entities/joueur.subscriber';
import { JoueursController } from './joueurs.controller';
import { JoueursService } from './joueurs.service';
import { Amis } from 'src/amis/entities/amis.entity';
import { ClassementService } from 'src/classement/classement.service';
import { Classement } from 'src/classement/entities/classement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Joueur, Classement, Amis])],
  controllers: [JoueursController],
  providers: [JoueursService, JoueurSubscriber, ClassementService],
  exports: [JoueursService, ClassementService],
})
export class JoueursModule {}