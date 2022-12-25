import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InternalNestMediatorLogger extends Logger {
  constructor() {
    super('Mediator');
  }
}
