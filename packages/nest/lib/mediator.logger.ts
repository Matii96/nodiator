import { Logger } from '@nestjs/common';

export class MediatorLogger extends Logger {
  constructor(namespace?: string) {
    super(`Nodiator${namespace ? `-${namespace}` : ''}`);
  }

  info(msg: string) {
    return this.log(msg);
  }
}
