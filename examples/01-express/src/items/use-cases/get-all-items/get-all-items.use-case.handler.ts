import { RequestHandler, IRequestHandler } from '@nodiator/core';
import { ItemsRepository } from '../../items.repository';
import { GetAllItemsUseCase } from './get-all-items.use-case';
import { GetAllItemsUseCaseResult } from './get-all-items.use-case.result';

@RequestHandler(GetAllItemsUseCase)
export class GetAllItemsUseCaseHandler implements IRequestHandler<GetAllItemsUseCase, GetAllItemsUseCaseResult> {
  async handle(request: GetAllItemsUseCase) {
    return ItemsRepository.findAll(request.search);
  }
}
