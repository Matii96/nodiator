import { filter, Observable } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { IMediatorLogger } from '../../../config/mediator.options';
import { IEventProcessingState } from '../../../executor/messages/events/interfaces/event-processing-state.interface';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';

export class EventsBeginningEndingLoggingBehaviour implements ILoggingBehaviour {
  private readonly _occuredEvents = new Map<string, Date>();

  constructor(private readonly _logger: IMediatorLogger, source: Observable<IEventProcessingState>) {
    const events = source.pipe(filter((state) => state.messageType === MessageTypes.EVENT));
    events.pipe(filter((state) => !this._occuredEvents.has(state.id))).subscribe((state) => this.firstEntry(state));
    events.pipe(filter((state) => Boolean(state.processed))).subscribe((state) => this.eventProcessed(state));
  }

  private firstEntry(state: IEventProcessingState) {
    this._occuredEvents.set(state.id, new Date());
    this._logger.debug(`Emmited ${state.message.constructor.name} (id=${state.id})`);
  }

  private eventProcessed(state: IEventProcessingState) {
    const elapsedTime = Date.now() - this._occuredEvents.get(state.id).getTime();
    this._occuredEvents.delete(state.id);
    if (!state.error) {
      this._logger.debug(
        ` -- ${state.message.constructor.name} (id=${state.id}) took ${(elapsedTime / 1000).toFixed(3)}s`
      );
      this._logger.info(`${state.message.constructor.name} (id=${state.id}) handled`);
    }
  }
}
