/* eslint-disable prettier/prettier */
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Joueur } from './joueurs/entities/joueur.entity';
import { JoueursModule } from './joueurs/joueurs.module';

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
        entities: [Joueur],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    JoueursModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit{

  onModuleInit() {
    console.log(__dirname + '/**/*.entity{.ts,.js}')
  }

}
