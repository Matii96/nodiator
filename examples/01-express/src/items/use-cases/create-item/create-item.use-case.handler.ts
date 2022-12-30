import { randomUUID } from 'crypto';
import { RequestHandler, IRequestHandler } from '@nodiator/core';
import { Item } from '../../item';
import { ItemsRepository } from '../../items.repository';
import { CreateItemUseCaseResult } from './create-item.use-case.result';
import { CreateItemUseCase } from './create-item.use-case';

@RequestHandler(CreateItemUseCase)
export class CreateItemUseCaseHandler implements IRequestHandler<CreateItemUseCase, CreateItemUseCaseResult> {
  async handle(request: CreateItemUseCase) {
    const item = new Item({
      id: randomUUID(),
      name: request.name ?? 'none',
      description: request.description ?? 'none',
    });
    ItemsRepository.create(item);
    return item;
  }
}
