import { Mediator } from '../mediator/mediator';

export interface MediatorExtension {
  init(mediator: Mediator): void;
}
