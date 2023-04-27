import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PartieService } from './partie.service';
import { Partie } from './entities/partie.entity';

@Controller('partie')
export class PartieController {
  constructor(private readonly partieService: PartieService) {}
  
}
