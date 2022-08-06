import { Injectable } from '@nestjs/common';
import { IMediator } from '@nodiator/core';
import { InjectMediator } from '../../lib';
import { Namespaces } from './namespaces.enum';

@Injectable()
export class AccessProvider {
  constructor(
    @InjectMediator() readonly globalMediator: IMediator,
    @InjectMediator(Namespaces.NAMESPACE1) readonly namespace1Mediator: IMediator,
    @InjectMediator(Namespaces.NAMESPACE2) readonly namespace2Mediator: IMediator
  ) {}
}
