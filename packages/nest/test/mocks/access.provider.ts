import { Injectable } from '@nestjs/common';
import { Mediator } from '@nodiator/core';
import { InjectMediator } from '../../lib';
import { Namespaces } from './namespaces.enum';

@Injectable()
export class AccessProvider {
  constructor(
    @InjectMediator() readonly globalMediator: Mediator,
    @InjectMediator(Namespaces.CATS) readonly catsMediator: Mediator,
    @InjectMediator(Namespaces.DOGS) readonly dogsMediator: Mediator
  ) {}
}
