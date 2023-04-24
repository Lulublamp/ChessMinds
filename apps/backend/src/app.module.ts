import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchMakingModule } from './network/match-making/match-making.module';
import { InGameModule } from './network/in-game/in-game.module';
import { AuthModule } from './auth/auth.module';
import { ClassementModule } from './classement/classement.module';
import { RencontreCoupsModule } from './rencontre/rencontre-coups.module';
import { Classement } from './classement/entities/classement.entity';
import { Joueur } from './joueurs/entities/joueur.entity';
import { JoueursModule } from './joueurs/joueurs.module';
import { Partie } from './partie/entities/partie.entity';
import { Rencontre } from './rencontre/entities/rencontre.entity';

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
        password: configService.get('MYSQL_PASSWORD') || 'root',
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
    InGameModule,
    RencontreCoupsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MatchMakingModule],
})
export class AppModule {
  afterInit() {
    console.log('AppModule initialized');
    console.log();
  }
}
