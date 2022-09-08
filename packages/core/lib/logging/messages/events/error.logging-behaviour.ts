import { filter, Observable } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { IMediatorLogger } from '../../../config/mediator.options';
import { IEventProcessingState } from '../../../executor/messages/events/interfaces/event-processing-state.interface';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';

export class EventsErrorLoggingBehaviour implements ILoggingBehaviour {
  constructor(private readonly _logger: IMediatorLogger, source: Observable<IEventProcessingState>) {
    source
      .pipe(filter((state) => state.messageType === MessageTypes.EVENT && state.error && !state.processed))
      .subscribe((state) => this.handle(state));
  }

  private handle(state: IEventProcessingState) {
    this._logger.error(
      ` -- ${state.provider.constructor.name} failed to handle ${state.message.constructor.name} (id=${state.id}}). ${
        state.error.stack || state.error.message || state.error
      }`
    );
  }
}
