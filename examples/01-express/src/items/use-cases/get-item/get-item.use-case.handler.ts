import { RequestHandler, IRequestHandler } from '@nodiator/core';
import { ItemsRepository } from '../../items.repository';
import { GetItemUseCase } from './get-item.use-case';
import { GetItemUseCaseResult } from './get-item.use-case.result';

@RequestHandler(GetItemUseCase)
export class GetItemUseCaseHandler implements IRequestHandler<GetItemUseCase, GetItemUseCaseResult> {
  async handle(request: GetItemUseCase) {
    return ItemsRepository.findById(request.id);
  }
}
