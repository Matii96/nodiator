import { MediatorNestException } from './nest-mediator.exception';

export class MissingAsyncConfigurationException extends MediatorNestException {
  constructor() {
    super('Async mediator configuration needs useFactory, useClass or useExisting');
  }
}
