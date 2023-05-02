import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rencontre } from './entities/rencontre.entity';
import { RencontreController } from './rencontre.controller';
import { RencontreService } from './rencontre.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rencontre])],
  controllers: [RencontreController],
  providers: [RencontreService],
  exports: [RencontreService],
})
export class RencontreModule {}
