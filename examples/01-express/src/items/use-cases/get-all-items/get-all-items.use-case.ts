import { ResponseType } from '@nodiator/core';
import { GetAllItemsUseCaseResult } from './get-all-items.use-case.result';

export class GetAllItemsUseCase {
  [ResponseType]?: GetAllItemsUseCaseResult;
  constructor(readonly search?: string) {}
}
