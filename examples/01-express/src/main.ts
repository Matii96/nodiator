import express, { Request, Response } from 'express';
import { MediatorFactory } from '@nodiator/core';
import { HistoryPipeline } from './history/history.pipeline';
import { GetHistoryUseCase } from './use-cases/get-history/get-history.use-case';
import { GetHistoryUseCaseResult } from './use-cases/get-history/get-history.use-case.result';
import { GetHistoryUseCaseHandler } from './use-cases/get-history/get-history.use-case.handler';
import { GetAllItemsUseCase } from './use-cases/get-all-items/get-all-items.use-case';
import { GetAllItemsUseCaseResult } from './use-cases/get-all-items/get-all-items.use-case.result';
import { GetItemUseCaseResult } from './use-cases/get-item/get-item.use-case.result';
import { GetItemUseCase } from './use-cases/get-item/get-item.use-case';
import { CreateItemUseCase } from './use-cases/create-item/create-item.use-case';
import { CreateItemUseCaseResult } from './use-cases/create-item/create-item.use-case.result';
import { UpdateItemUseCase } from './use-cases/update-item/update-item.use-case';
import { DeleteItemUseCase } from './use-cases/delete-item/delete-item.use-case';
import { CreateItemUseCaseHandler } from './use-cases/create-item/create-item.use-case.handler';
import { DeleteItemUseCaseHandler } from './use-cases/delete-item/delete-item.use-case.handler';
import { GetAllItemsUseCaseHandler } from './use-cases/get-all-items/get-all-items.use-case.handler';
import { GetItemUseCaseHandler } from './use-cases/get-item/get-item.use-case.handler';
import { UpdateItemUseCaseHandler } from './use-cases/update-item/update-item.use-case.handler';

const port = 3000;
const app = express();
const mediator = MediatorFactory.create({
  providers: [
    HistoryPipeline,
    GetHistoryUseCaseHandler,
    CreateItemUseCaseHandler,
    DeleteItemUseCaseHandler,
    GetAllItemsUseCaseHandler,
    GetItemUseCaseHandler,
    UpdateItemUseCaseHandler,
  ],
  loggingLevel: 'DEBUG',
});

app.get('/history', async (req: Request, res: Response) => {
  const result = await mediator.request<GetHistoryUseCaseResult>(new GetHistoryUseCase());
  res.send(result);
});
app.get('items/:id', async (req: Request, res: Response) => {
  const result = await mediator.request<GetItemUseCaseResult>(new GetItemUseCase(req.params.id));
  res.send(result);
});
app.get('items', async (req: Request, res: Response) => {
  const result = await mediator.request<GetAllItemsUseCaseResult>(new GetAllItemsUseCase(<string>req.query.search));
  res.send(result);
});
app.post('items', async (req: Request, res: Response) => {
  const result = await mediator.request<CreateItemUseCaseResult>(
    new CreateItemUseCase(req.body.name, req.body.description)
  );
  res.send(result);
});
app.put('items/:id', async (req: Request, res: Response) => {
  await mediator.request<void>(new UpdateItemUseCase(req.params.id, req.body.name, req.body.description));
  res.send('ok');
});
app.delete('items/:id', async (req: Request, res: Response) => {
  await mediator.request<void>(new DeleteItemUseCase(req.params.id));
  res.send('ok');
});

app.listen(port, () => console.log('Listening on port ' + port));
