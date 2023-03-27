/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchMakingModule } from './network/match-making/match-making.module';
import { InGameModule } from './network/in-game/in-game.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'mysql',
    //     host: configService.get('MYSQL_HOST') || 'localhost',
    //     port: configService.get('MYSQL_PORT') || 3306,
    //     username: configService.get('MYSQL_USER') || 'root',
    //     database: configService.get('MYSQL_DATABASE') || 'chess-bdd',
    //     entities: [Joueur, Rencontre, Partie, Classement],
    //     autoLoadEntities: true,
    //     synchronize: true,
    //   }),
    //   inject: [ConfigService],
    // }),
    MatchMakingModule,
    // AuthModule,
    // JoueursModule,
    // ClassementModule,
    InGameModule,
  ],
  controllers: [AppController],
  providers: [AppService, MatchMakingModule],
})
export class AppModule {}
