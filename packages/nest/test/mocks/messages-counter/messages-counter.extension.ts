import { Injectable } from '@nestjs/common';
import { Mediator, MediatorExtension } from '@nodiator/core';

@Injectable()
export class MessagesCounterExtension implements MediatorExtension {
  init = jest.fn((mediator: Mediator) => mediator.bus.subscribe(() => this.handleNewMessage()));
  handleNewMessage = jest.fn();
}
