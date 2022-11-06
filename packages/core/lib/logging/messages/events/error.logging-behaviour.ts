import { filter, Observable } from 'rxjs';
import { IMessageProvider, MessageTypes } from '../../../messages';
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
      .pipe(filter((state) => state.messageType === MessageTypes.EVENT && Boolean(state.error) && !state.processed))
      .subscribe((state) => this.handle(state));
  }

  private handle(state: IEventProcessingState) {
    const error = state.error as Error;
    const errorString = error.stack || error.message || error;
    this.log(
      error,
      ` -- ${(state.provider as IMessageProvider).constructor.name} failed to handle ${
        state.message.constructor.name
      } (id=${state.id}). ${errorString}`
    );
  }
}
