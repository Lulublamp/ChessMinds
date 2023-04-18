import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CoupsService } from './coups.service';
import { CreateCoupDto } from './DTO/coups.dto';
import { Coups } from './entities/coups.entity';

@Controller('coups')
export class CoupsController {
  constructor(private readonly coupsService: CoupsService) {}

}
