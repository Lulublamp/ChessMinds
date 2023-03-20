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
import { MatchMakingModule } from './network/match-making/match-making.module';
import { AuthModule } from './auth/auth.module';
import { JoueursModule } from './joueurs/joueurs.module';
import { ClassementModule } from './classement/classement.module';
import { InitGameGateway } from './init-game/init-game.gateway';
import { MatchMakingGateway } from './network/match-making/match-making.gateway';

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
        entities: [Joueur, Rencontre, Partie, Classement],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MatchMakingModule,
    AuthModule,
    JoueursModule,
    ClassementModule,
  ],
  controllers: [AppController],
  providers: [AppService, MatchMakingModule],
})
export class AppModule {}
