import { Logger } from '@nestjs/common';
import { MediatorLogger } from '@nodiator/extension-logger';

export class NestMediatorLogger extends Logger implements MediatorLogger {
  constructor() {
    super('Mediator');
  }

  info(msg: string) {
    return this.log(msg);
  }
}
