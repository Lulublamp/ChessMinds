import { Module } from '@nestjs/common';
import { ClassementBulletService } from './classement_bullet.service';

@Module({
  providers: [ClassementBulletService]
})
export class ClassementBulletModule {
  
}
