import { Injectable } from '@nestjs/common';
import { IMediator } from '@nodiator/core';
import { InjectMediator } from '../../lib';
import { Namespaces } from './namespaces.enum';

@Injectable()
export class AccessProvider {
  constructor(
    @InjectMediator() readonly globalMediator: IMediator,
    @InjectMediator(Namespaces.CATS) readonly catsMediator: IMediator,
    @InjectMediator(Namespaces.DOGS) readonly dogsMediator: IMediator
  ) {}
}
