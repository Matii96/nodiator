import { Injectable } from '@nestjs/common';
import { Mediator } from '@nodiator/core';
import { InjectMediator } from '../../lib';
import { BirdsModuleMock } from './birds/birds.module.mock';
import { CatsModuleMock } from './cats/cats.module.mock';
import { DOGS_NAMESPACE } from './dogs/constants';

@Injectable()
export class AccessProvider {
  constructor(
    @InjectMediator(CatsModuleMock) readonly catsMediator: Mediator,
    @InjectMediator(DOGS_NAMESPACE) readonly dogsMediator: Mediator,
    @InjectMediator(BirdsModuleMock) readonly birdsMediator: Mediator
  ) {}
}
