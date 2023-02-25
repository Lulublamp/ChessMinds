/* eslint-disable prettier/prettier */
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Classement } from './classement/entities/classement.entity';
import { Joueur } from './joueurs/entities/joueur.entity';
import { Partie } from './partie/entities/partie.entity';
import { Rencontre } from './rencontre/entities/rencontre.entity';
import { MatchMakingModule } from './match-making/match-making.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST') || 'localhost',
        port: configService.get('MYSQL_PORT') || 3306,
        username: configService.get('MYSQL_USER') || 'root',
        database: configService.get('MYSQL_DATABASE') || 'chess-bdd',
        entities: [Joueur,Rencontre,Partie,Classement],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MatchMakingModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
