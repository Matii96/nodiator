import { v4 as uuidv4 } from 'uuid';
import { RequestHandler, RequestHandler } from '@nodiator/core';
import { Item } from '../../item';
import { ItemsRepository } from '../../items.repository';
import { CreateItemUseCaseResult } from './create-item.use-case.result';
import { CreateItemUseCase } from './create-item.use-case';

@RequestHandler(CreateItemUseCase)
export class CreateItemUseCaseHandler implements RequestHandler<CreateItemUseCase, CreateItemUseCaseResult> {
  async handle(request: CreateItemUseCase) {
    const item = new Item({
      id: uuidv4(),
      name: request.name ?? 'none',
      description: request.description ?? 'none',
    });
    ItemsRepository.create(item);
    return item;
  }
}
