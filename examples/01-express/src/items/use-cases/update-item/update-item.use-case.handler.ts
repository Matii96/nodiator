import { RequestHandler, IRequestHandler } from '@nodiator/core';
import { ItemsRepository } from '../../items.repository';
import { UpdateItemUseCase } from './update-item.use-case';

@RequestHandler(UpdateItemUseCase)
export class UpdateItemUseCaseHandler implements IRequestHandler<UpdateItemUseCase> {
  async handle(request: UpdateItemUseCase) {
    ItemsRepository.update(request);
  }
}
