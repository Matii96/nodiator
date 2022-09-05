import { filter, Observable } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { IMediatorLogger } from '../../../mediator/mediator.options';
import { IEventProcessingState } from '../../../executor/messages/events/interfaces/event-processing-state.interface';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';

export class EventsBeginningEndingLoggingBehaviour implements ILoggingBehaviour {
  private readonly occuredEvents = new Map<string, Date>();

  constructor(private readonly logger: IMediatorLogger, source: Observable<IEventProcessingState>) {
    const events = source.pipe(filter((state) => state.messageType === MessageTypes.EVENT));
    events.pipe(filter((state) => !this.occuredEvents.has(state.id))).subscribe((state) => this.firstEntry(state));
    events.pipe(filter((state) => Boolean(state.processed))).subscribe((state) => this.eventProcessed(state));
  }

  private firstEntry(state: IEventProcessingState) {
    this.occuredEvents.set(state.id, new Date());
    this.logger.debug(`Emmited ${state.message.constructor.name} (id=${state.id}})`);
  }

  private eventProcessed(state: IEventProcessingState) {
    const elapsedTime = Date.now() - this.occuredEvents.get(state.id).getTime();
    this.occuredEvents.delete(state.id);
    if (!state.error) {
      this.logger.info(`${state.message.constructor.name} processed in ${(elapsedTime / 1000).toFixed(3)}s`);
    }
  }
}
