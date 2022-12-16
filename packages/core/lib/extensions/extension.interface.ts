import { Mediator } from '../mediator/ports/mediator.port';

export interface MediatorExtension {
  init(mediator: Mediator): void;
}
