import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Joueur } from './entities/joueur.entity';
import { JoueurSubscriber } from './entities/joueur.subscriber';
import { JoueursController } from './joueurs.controller';
import { JoueursService } from './joueurs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Joueur])],
  controllers: [JoueursController],
  providers: [JoueursService, JoueurSubscriber],
})
export class JoueursModule {}