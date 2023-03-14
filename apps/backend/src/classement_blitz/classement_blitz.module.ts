import { Module } from '@nestjs/common';
import { ClassementBlitzService } from './classement_blitz.service';
import { ClassementBlitzController } from './classement_blitz.controller';

@Module({
  providers: [ClassementBlitzService],
  controllers: [ClassementBlitzController]
})
export class ClassementBlitzModule {}
