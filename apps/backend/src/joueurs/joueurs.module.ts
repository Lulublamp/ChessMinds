import { Module } from '@nestjs/common';
import { JoueursController } from './joueurs.controller';
import { JoueursService } from './joueurs.service';

@Module({
  controllers: [JoueursController],
  providers: [JoueursService]
})
export class JoueursModule {}
