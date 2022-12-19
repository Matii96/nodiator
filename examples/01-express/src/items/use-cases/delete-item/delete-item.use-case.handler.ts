import { RequestHandler, IRequestHandler } from '@nodiator/core';
import { ItemsRepository } from '../../items.repository';
import { DeleteItemUseCase } from './delete-item.use-case';

@RequestHandler(DeleteItemUseCase)
export class DeleteItemUseCaseHandler implements IRequestHandler<DeleteItemUseCase, void> {
  async handle(request: DeleteItemUseCase) {
    ItemsRepository.remove(request.id);
  }
}
