import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Joueurs } from 'src/typeorm/entities/Joueurs';
import { JoueursController } from './controllers/joueurs/joueurs.controller';
import { JoueursService } from './service/joueurs/joueurs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Joueurs])],
  controllers: [JoueursController],
  providers: [JoueursService]
})
export class JoueursModule {}
