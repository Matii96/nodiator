import { RequestHandler, RequestHandler } from '@nodiator/core';
import { HistoryRepository } from '../../../history/history.repository';
import { GetHistoryUseCaseResult } from './get-history.use-case.result';
import { GetHistoryUseCase } from './get-history.use-case';

@RequestHandler(GetHistoryUseCase)
export class GetHistoryUseCaseHandler implements RequestHandler<GetHistoryUseCase, GetHistoryUseCaseResult> {
  async handle() {
    return HistoryRepository.getAll();
  }
}
