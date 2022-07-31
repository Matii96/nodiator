import { filter, Observable } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { IMediatorLogger } from '../../../mediator.options';
import { IEventProcessingState } from '../../../executor/messages/events/interfaces/event-processing-state.interface';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';

export class EventsHandlingStartedLoggingBehaviour implements ILoggingBehaviour {
  constructor(private readonly logger: IMediatorLogger, source: Observable<IEventProcessingState>) {
    source
      .pipe(filter((state) => state.messageType === MessageTypes.EVENT && state.provider && !state.handled))
      .subscribe((state) => this.handle(state));
  }

  private handle(state: IEventProcessingState) {
    this.logger.debug(
      `  -- handling ${state.message.constructor.name} (id=${state.id}}) with ${state.provider.constructor.name}`
    );
  }
}
