import { filter, Observable } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { IMediatorLogger } from '../../../mediator/mediator.options';
import { IRequestProcessingState } from '../../../executor/messages/requests/interfaces/request-processing-state.interface';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';

interface IOngoingRequest {
  startedAt: Date;
}

export class RequestsBeginningEndingLoggingBehaviour implements ILoggingBehaviour {
  private readonly ongoingRequests = new Map<string, IOngoingRequest>();

  constructor(private readonly logger: IMediatorLogger, source: Observable<IRequestProcessingState>) {
    const requests = source.pipe(filter((state) => state.messageType === MessageTypes.REQUEST));
    requests.pipe(filter((state) => !this.ongoingRequests.has(state.id))).subscribe((state) => this.firstEntry(state));
    requests.pipe(filter((state) => state.processed)).subscribe((state) => this.requestProcessed(state));
  }

  private firstEntry(state: IRequestProcessingState) {
    this.ongoingRequests.set(state.id, { startedAt: new Date() });
    this.logger.debug(`Requested ${state.message.constructor.name} (id=${state.id}})`);
  }

  private requestProcessed(state: IRequestProcessingState) {
    const elapsedTime = Date.now() - this.ongoingRequests.get(state.id).startedAt.getTime();
    this.ongoingRequests.delete(state.id);

    // Let other logging behaviours to run before final message
    setImmediate(() =>
      this.logger.info(`${state.message.constructor.name} processed in ${(elapsedTime / 1000).toFixed(3)}s`)
    );
  }
}
