import { Express } from 'express';
import { Mediator } from '@nodiator/core';
import { HistoryPipeline } from './history.pipeline';
import { GetHistoryUseCaseResult } from './use-cases/get-history/get-history.use-case.result';
import { GetHistoryUseCase } from './use-cases/get-history/get-history.use-case';
import { GetHistoryUseCaseHandler } from './use-cases/get-history/get-history.use-case.handler';

export const historyBootstrapper = (app: Express, mediator: Mediator) => {
  mediator.providers.register(HistoryPipeline, GetHistoryUseCaseHandler);

  app.get('/history', (req, res) => {
    mediator.request<GetHistoryUseCaseResult>(new GetHistoryUseCase()).subscribe((history) => res.send(history));
  });
};
