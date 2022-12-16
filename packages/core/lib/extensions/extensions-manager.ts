import { Mediator } from '../mediator/ports/mediator.port';
import { MediatorExtension } from './extension.interface';
import { ExtensionsManager } from './ports/extensions-manager.port';

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
