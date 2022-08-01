import { MediatorNestException } from './nest-mediator.exception';

export class NamespaceNotInitializedException extends MediatorNestException {
  constructor(namespace: string) {
    super(
      `Namespace ${namespace} has no mediator initialized in application root. ` +
        `Did you forget to import MediatorModule.forRoot({ namespace: '${namespace}' }) in AppModule?`
    );
  }
}
