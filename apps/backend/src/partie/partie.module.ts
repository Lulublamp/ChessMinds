import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartieService } from './partie.service';
import { PartieController } from './partie.controller';
import { Partie } from './entities/partie.entity';
import { RencontreModule } from 'src/rencontre/rencontre.module';

@Module({
  imports: [TypeOrmModule.forFeature([Partie]), RencontreModule],
  controllers: [PartieController],
  providers: [PartieService],
  exports: [PartieService],
})
export class PartieModule {}
