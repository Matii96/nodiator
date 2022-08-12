import { DuplicatedNamespacesException } from '../exceptions/duplicated-namespaces.exception';
import { MediatorModuleOptions } from './mediator.module.options';

export class MediatorModuleOptionsValidator {
  static validate(configurations: MediatorModuleOptions[]) {
    const namespacesOccurrences = configurations.reduce(
      (acc, { namespace }) => (acc.set(namespace, (acc.get(namespace) || 0) + 1), acc),
      new Map<string, number>()
    );
    const duplicatedNamespaces = Array.from(namespacesOccurrences.keys()).filter(
      (namespace) => namespacesOccurrences.get(namespace) > 1
    );
    if (duplicatedNamespaces.length > 0) {
      throw new DuplicatedNamespacesException(duplicatedNamespaces);
    }
  }
}
