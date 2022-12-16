import { RequestHandler, RequestHandler } from '@nodiator/core';
import { ItemsRepository } from '../../items.repository';
import { GetItemUseCase } from './get-item.use-case';
import { GetItemUseCaseResult } from './get-item.use-case.result';

@RequestHandler(GetItemUseCase)
export class GetItemUseCaseHandler implements RequestHandler<GetItemUseCase, GetItemUseCaseResult> {
  async handle(request: GetItemUseCase) {
    return ItemsRepository.findById(request.id);
  }
}
