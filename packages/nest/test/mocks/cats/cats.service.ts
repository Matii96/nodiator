import { Injectable } from '@nestjs/common';
import { Mediator } from '@nodiator/core';
import { InjectMediator } from '../../../lib';

@Injectable()
export class CatsService {
  constructor(@InjectMediator() private readonly _mediator: Mediator) {}
}
