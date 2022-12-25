import { MediatorLogger } from '@nodiator/extension-logger';
import { InternalNestMediatorLogger } from '../mediator.logger';

export class NestMediatorLogger extends InternalNestMediatorLogger implements MediatorLogger {
  info(msg: string) {
    return this.log(msg);
  }
}
