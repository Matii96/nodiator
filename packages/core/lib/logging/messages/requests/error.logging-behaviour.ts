import { filter, Observable } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { IMediatorLogger } from '../../../mediator/mediator.options';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';
import { IRequestProcessingState } from '../../../executor/messages/requests/interfaces/request-processing-state.interface';

export class RequestsErrorLoggingBehaviour implements ILoggingBehaviour {
  constructor(private readonly logger: IMediatorLogger, source: Observable<IRequestProcessingState>) {
    source
      .pipe(filter((state) => state.messageType === MessageTypes.REQUEST && Boolean(state.error)))
      .subscribe((state) => this.handle(state));
  }

  private handle(state: IRequestProcessingState) {
    const requestString = `${state.message.constructor.name} (id=${state.id}})`;
    const errorString = state.error.stack || state.error.message || state.error;

    this.logger.error(
      state.provider
        ? ` -- ${state.provider.constructor.name} failed to handle ${requestString}. ${errorString}`
        : `${state.message.constructor.name} failed. ${errorString}`
    );
  }
}
