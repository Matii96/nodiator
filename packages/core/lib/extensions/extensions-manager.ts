import { IMediator } from '../mediator/ports/mediator.port';
import { IMediatorExtension } from './extension.interface';
import { IExtensionsManager } from './ports/extensions-manager.port';

export class ExtensionsManager implements IExtensionsManager {
  private readonly _extensions = new Set<IMediatorExtension>();

  list() {
    return Array.from(this._extensions);
  }

  load(extension: IMediatorExtension, mediator: IMediator) {
    extension.init(mediator);
    this._extensions.add(extension);
  }
}
