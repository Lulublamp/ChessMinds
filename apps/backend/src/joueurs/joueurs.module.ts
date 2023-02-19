import { Module } from '@nestjs/common';
import { JoueursService } from './joueurs.service';
import { JoueursController } from './joueurs.controller';

@Module({
  controllers: [JoueursController],
  providers: [JoueursService]
})
export class JoueursModule {}
