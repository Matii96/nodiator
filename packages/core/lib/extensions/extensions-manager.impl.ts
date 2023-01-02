import { Mediator } from '../mediator/mediator';
import { MediatorExtension } from './extension';
import { ExtensionsManager } from './extensions-manager';

export class MediatorExtensionsManager implements ExtensionsManager {
  private readonly _extensions = new Set<MediatorExtension>();

  list() {
    return Array.from(this._extensions);
  }

  load(extension: MediatorExtension, mediator: Mediator) {
    extension.init(mediator);
    this._extensions.add(extension);
  }
}
