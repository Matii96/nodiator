import { GlobalRequestPipeline, IRequest, IGlobalRequestPipeline } from '@nodiator/core';
import { finalize, Observable } from 'rxjs';
import { HistoryEntry } from './history-entry';
import { HistoryRepository } from './history.repository';

@GlobalRequestPipeline()
export class HistoryPipeline implements IGlobalRequestPipeline {
  handle(request: IRequest, next: Observable<unknown>) {
    const start = new Date();
    return next.pipe(
      finalize(() =>
        HistoryRepository.register(
          HistoryEntry.fromMessage({
            message: request,
            executionTime: Date.now() - start.getTime(),
            timestamp: start,
          })
        )
      )
    );
  }
}
