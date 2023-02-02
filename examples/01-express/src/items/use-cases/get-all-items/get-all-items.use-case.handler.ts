import { RequestHandler, IRequestHandler } from '@nodiator/core';
import { ItemsRepository } from '../../items.repository';
import { GetAllItemsUseCase } from './get-all-items.use-case';

@RequestHandler(GetAllItemsUseCase)
export class GetAllItemsUseCaseHandler implements IRequestHandler<GetAllItemsUseCase> {
  async handle(request: GetAllItemsUseCase) {
    return ItemsRepository.findAll(request.search);
  }
}
