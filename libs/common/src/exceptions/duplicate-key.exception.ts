import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateKeyException extends HttpException {
  constructor() {
    super('Duplicate key error', HttpStatus.CONFLICT);
  }
}