import { RequestHandler, IRequestHandler } from '@nodiator/core';
import { HistoryRepository } from '../../history.repository';
import { GetHistoryUseCase } from './get-history.use-case';

@RequestHandler(GetHistoryUseCase)
export class GetHistoryUseCaseHandler implements IRequestHandler<GetHistoryUseCase> {
  async handle() {
    return HistoryRepository.getAll();
  }
}
