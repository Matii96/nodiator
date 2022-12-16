import { RequestHandler, RequestHandler } from '@nodiator/core';
import { ItemsRepository } from '../../items.repository';
import { DeleteItemUseCase } from './delete-item.use-case';

@RequestHandler(DeleteItemUseCase)
export class DeleteItemUseCaseHandler implements RequestHandler<DeleteItemUseCase, void> {
  async handle(request: DeleteItemUseCase) {
    ItemsRepository.remove(request.id);
  }
}
