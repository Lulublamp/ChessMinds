import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassementController } from './classement.controller';
import { ClassementService } from './classement.service';
import { Classement } from './entities/classement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Classement])],
  controllers: [ClassementController],
  providers: [ClassementService],
  exports: [ClassementService]
})
export class ClassementModule {}
