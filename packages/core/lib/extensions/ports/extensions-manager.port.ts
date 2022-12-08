import { IMediator } from '../../mediator/ports/mediator.port';
import { IMediatorExtension } from '../extension.interface';

export interface IExtensionsManager {
  list(): IMediatorExtension[];
  load(extension: IMediatorExtension, mediator: IMediator): void;
}
