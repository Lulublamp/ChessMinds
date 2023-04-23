/* eslint-disable prettier/prettier */
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Nt } from '@TRPI/core';
import { ServerOptions } from 'https';

export class AuthenticatedSocketAdapter extends IoAdapter {
  private readonly authService: AuthService;


  constructor(app: INestApplicationContext) {
    super(app);
    this.authService = app.get(AuthService);
  }

  private validate = async (socket , next) => {
    const tokenPayload = socket.handshake?.auth.access_token;
    if (!tokenPayload) {
      return next(new Error('Token not found'));
    }

    const [method, token] = tokenPayload.split(' ');

    try {
      socket.user = {};
      const user = await this.authService.validateToken(token);
      console.log('match-making: AuthenticatedSocketAdapter success')
      socket.user = user;
      return next();
    } catch (error: any) {
      return next(new Error('Authentication error'));
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    // server.use(async (socket: any, next) => {
    //   // await this.validate(socket, next);
    // });
    
    server.of(Nt.NAMESPACE_TYPES.MATCH_MAKING).use(async (socket: any, next) => {
      console.log('match-making: AuthenticatedSocketAdapter')
      await this.validate(socket, next);
    });

    // server.of(Nt.NAMESPACE_TYPES.PRIVATE_LOBBY).use(async (socket: any, next) => {
    //   console.log('mm-ranked: AuthenticatedSocketAdapter passed')
    //   // await this.validate(socket, next);
    //   next()
    // });


    return server;
  }
}