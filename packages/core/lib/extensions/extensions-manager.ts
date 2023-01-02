import { Mediator } from '../mediator/mediator';
import { MediatorExtension } from './extension';

export interface ExtensionsManager {
  list(): MediatorExtension[];
  load(extension: MediatorExtension, mediator: Mediator): void;
}
