import { filter, Observable } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { IMediatorLogger, MediatorOptions } from '../../../config/mediator.options';
import { IEventProcessingState } from '../../../executor/messages/events/interfaces/event-processing-state.interface';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';
import { SharedErrorLoggingBehaviour } from '../shared/error.logging-behaviour';

export class EventsErrorLoggingBehaviour extends SharedErrorLoggingBehaviour implements ILoggingBehaviour {
  constructor(
    protected readonly _logger: IMediatorLogger,
    source: Observable<IEventProcessingState>,
    options: MediatorOptions
  ) {
    super(_logger, options);
    source
      .pipe(filter((state) => state.messageType === MessageTypes.EVENT && state.error && !state.processed))
      .subscribe((state) => this.handle(state));
  }

  private handle(state: IEventProcessingState) {
    const errorString = state.error.stack || state.error.message || state.error;
    this.log(
      state.error,
      ` -- ${state.provider.constructor.name} failed to handle ${state.message.constructor.name} (id=${state.id}). ${errorString}`
    );
  }
}
