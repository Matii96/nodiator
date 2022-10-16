import { GLOBAL_NAMESPACE } from '../injection/constants';
import { MediatorNestException } from './nest-mediator.exception';

export class DuplicatedNamespacesException extends MediatorNestException {
  constructor(namespaces: string[]) {
    const namespacesString = namespaces.map((namespace = GLOBAL_NAMESPACE) => namespace).join(', ');
    super(`Duplicated mediator namespace${namespaces.length > 1 ? 's' : ''} ${namespacesString}`);
  }
}
