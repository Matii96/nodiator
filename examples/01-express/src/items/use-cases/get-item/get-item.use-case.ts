import { ResponseType } from '@nodiator/core';
import { GetItemUseCaseResult } from './get-item.use-case.result';

export class GetItemUseCase {
  [ResponseType]?: GetItemUseCaseResult;
  constructor(readonly id: string) {}
}
