/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export class PlayerNotFound extends HttpException {
  constructor() {
    super('Player not found', HttpStatus.NOT_FOUND);
  }
}

export class PlayerAlreadyExists extends HttpException {
  constructor() {
    super('Player already exists', HttpStatus.CONFLICT);
  }
}

export class PlayerNotCreated extends HttpException {
  constructor() {
    super('Player not created', HttpStatus.BAD_REQUEST);
  }
}

export class AlreadyFriends extends HttpException {
  constructor() {
    super('Already friends', HttpStatus.CONFLICT);
  }
}