import { RequestHandler, RequestHandler } from '@nodiator/core';
import { ItemsRepository } from '../../items.repository';
import { UpdateItemUseCase } from './update-item.use-case';

@RequestHandler(UpdateItemUseCase)
export class UpdateItemUseCaseHandler implements RequestHandler<UpdateItemUseCase, void> {
  async handle(request: UpdateItemUseCase) {
    ItemsRepository.update(request);
  }
}
