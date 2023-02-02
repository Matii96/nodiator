import { RequestHandler, IRequestHandler } from '@nodiator/core';
import { ItemsRepository } from '../../items.repository';
import { GetItemUseCase } from './get-item.use-case';

@RequestHandler(GetItemUseCase)
export class GetItemUseCaseHandler implements IRequestHandler<GetItemUseCase> {
  async handle(request: GetItemUseCase) {
    const item = ItemsRepository.findById(request.id);
    if (!item) {
      throw new Error(`Item with id=${request.id} not found`);
    }
    return item;
  }
}
