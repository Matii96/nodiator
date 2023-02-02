import { ResponseType } from '@nodiator/core';
import { CreateItemUseCaseResult } from './create-item.use-case.result';

export class CreateItemUseCase {
  readonly [ResponseType]: CreateItemUseCaseResult;
  constructor(readonly name: string, readonly description: string) {}
}
