import { filter, Observable } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { IMediatorLogger, MediatorOptions } from '../../../config/mediator.options';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';
import { IRequestProcessingState } from '../../../executor/messages/requests/interfaces/request-processing-state.interface';
import { SharedErrorLoggingBehaviour } from '../shared/error.logging-behaviour';

export class RequestsErrorLoggingBehaviour extends SharedErrorLoggingBehaviour implements ILoggingBehaviour {
  constructor(
    protected readonly _logger: IMediatorLogger,
    source: Observable<IRequestProcessingState>,
    options: MediatorOptions
  ) {
    super(_logger, options);
    source
      .pipe(filter((state) => state.messageType === MessageTypes.REQUEST && Boolean(state.error)))
      .subscribe((state) => this.handle(state));
  }

  private handle(state: IRequestProcessingState) {
    const requestString = `${state.message.constructor.name} (id=${state.id})`;
    const errorString = state.error.stack || state.error.message || state.error;

    this.log(
      state.error,
      state.provider
        ? ` -- ${state.provider.constructor.name} failed to handle ${requestString}. ${errorString}`
        : `${state.message.constructor.name} failed. ${errorString}`
    );
  }
}
