import { ResponseType } from '@nodiator/core';
import { CreateItemUseCaseResult } from './create-item.use-case.result';

export class CreateItemUseCase {
  [ResponseType]: CreateItemUseCaseResult;
  constructor(readonly name: string, readonly description: string) {}
}
