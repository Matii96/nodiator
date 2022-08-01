import { Injectable } from '@nestjs/common';
import { Mediator } from '@nodiator/core';
import { InjectMediator } from '../../lib';
import { Namespaces } from './namespaces.enum';

@Injectable()
export class AccessProvider {
  constructor(
    @InjectMediator() readonly globalMediator: Mediator,
    @InjectMediator(Namespaces.NAMESPACE1) readonly namespace1Mediator: Mediator,
    @InjectMediator(Namespaces.NAMESPACE2) readonly namespace2Mediator: Mediator
  ) {}
}
