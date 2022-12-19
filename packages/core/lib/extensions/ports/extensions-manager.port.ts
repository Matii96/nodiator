import { Mediator } from '../../mediator/ports/mediator.port';
import { MediatorExtension } from '../extension.interface';

export interface ExtensionsManager {
  list(): MediatorExtension[];
  load(extension: MediatorExtension, mediator: Mediator): void;
}
