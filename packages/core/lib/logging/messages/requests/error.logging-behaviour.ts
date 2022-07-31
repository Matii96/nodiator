import { filter, Observable } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { IMediatorLogger } from '../../../mediator.options';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';
import { IRequestProcessingState } from '../../../executor/messages/requests/interfaces/request-processing-state.interface';

export class RequestsErrorLoggingBehaviour implements ILoggingBehaviour {
  constructor(private readonly logger: IMediatorLogger, source: Observable<IRequestProcessingState>) {
    source
      .pipe(filter((state) => state.messageType === MessageTypes.REQUEST && Boolean(state.error)))
      .subscribe((state) => this.handle(state));
  }

  private handle(state: IRequestProcessingState) {
    this.logger.error(
      `  -- ${state.provider.constructor.name} failed to handle ${state.message.constructor.name} (id=${state.id}}). ${
        state.error.stack || state.error.message || state.error
      }`
    );
  }
}