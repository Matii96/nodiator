import { IMediator } from '../mediator/ports/mediator.port';

export interface IMediatorExtension {
  init(mediator: IMediator): void;
}
