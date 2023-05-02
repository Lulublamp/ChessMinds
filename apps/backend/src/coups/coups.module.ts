import { Module } from '@nestjs/common';
import { CoupsService } from './coups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coups } from './entities/coups.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coups])],
  providers: [CoupsService],
  exports: [CoupsService, TypeOrmModule],
})
export class CoupsModule {}
