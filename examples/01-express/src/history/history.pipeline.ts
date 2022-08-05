import { GlobalRequestPipeline, IRequest, IRequestPipeline } from '@nodiator/core';
import { HistoryEntry } from './history-entry';
import { HistoryRepository } from './history.repository';

@GlobalRequestPipeline()
export class HistoryPipeline implements IRequestPipeline<IRequest, any> {
  async handle(request: IRequest, next: () => Promise<any>) {
    const start = new Date();
    const result = await next();
    HistoryRepository.register(
      HistoryEntry.fromMessage({
        message: request,
        executionTime: Date.now() - start.getTime(),
        timestamp: start,
      })
    );
    return result;
  }
}
