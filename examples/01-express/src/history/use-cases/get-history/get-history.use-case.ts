import { ResponseType } from '@nodiator/core';
import { GetHistoryUseCaseResult } from './get-history.use-case.result';

export class GetHistoryUseCase {
  readonly [ResponseType]?: GetHistoryUseCaseResult;
}
