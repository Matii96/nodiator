import { Express } from 'express';
import { Mediator } from '@nodiator/core';

import { GetItemUseCase } from './use-cases/get-item/get-item.use-case';
import { GetItemUseCaseHandler } from './use-cases/get-item/get-item.use-case.handler';

import { GetAllItemsUseCase } from './use-cases/get-all-items/get-all-items.use-case';
import { GetAllItemsUseCaseHandler } from './use-cases/get-all-items/get-all-items.use-case.handler';

import { CreateItemUseCase } from './use-cases/create-item/create-item.use-case';
import { CreateItemUseCaseHandler } from './use-cases/create-item/create-item.use-case.handler';

import { UpdateItemUseCase } from './use-cases/update-item/update-item.use-case';
import { UpdateItemUseCaseHandler } from './use-cases/update-item/update-item.use-case.handler';

import { DeleteItemUseCase } from './use-cases/delete-item/delete-item.use-case';
import { DeleteItemUseCaseHandler } from './use-cases/delete-item/delete-item.use-case.handler';

export const itemsBootstrapper = (app: Express, mediator: Mediator) => {
  mediator.providers.register(
    CreateItemUseCaseHandler,
    DeleteItemUseCaseHandler,
    GetAllItemsUseCaseHandler,
    GetItemUseCaseHandler,
    UpdateItemUseCaseHandler
  );

  app.get('/items/:id', (req, res) => {
    mediator.request(new GetItemUseCase(req.params.id)).subscribe((item) => res.send(item));
  });
  app.get('/items', (req, res) => {
    mediator.request(new GetAllItemsUseCase(<string>req.query.search)).subscribe((items) => res.send(items));
  });
  app.post('/items', (req, res) => {
    mediator.request(new CreateItemUseCase(req.body.name, req.body.description)).subscribe((item) => res.send(item));
  });
  app.put('/items/:id', (req, res) => {
    mediator
      .request(new UpdateItemUseCase(req.params.id, req.body.name, req.body.description))
      .subscribe(() => res.send('ok'));
  });
  app.delete('/items/:id', (req, res) => {
    mediator.request(new DeleteItemUseCase(req.params.id)).subscribe(() => res.send('ok'));
  });
};
