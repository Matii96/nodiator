import {
  IMessageProcessing,
  HandlingStartedEventProcessingState,
  HandlingCompletedEventProcessingState,
} from '@nodiator/core';
import { filter } from 'rxjs';
import { IMediatorLogger } from '../../mediator-logger/mediator-logger.port';
import { IProcessingObserver } from '../shared/processing-observer.interface';

export class EventProvidersProcessingObserver implements IProcessingObserver {
  private _processing: IMessageProcessing;

  constructor(private readonly _logger: IMediatorLogger) {}

  init(processing: IMessageProcessing) {
    this._processing = processing;
    processing.process
      .pipe(filter((state) => state instanceof HandlingStartedEventProcessingState))
      .subscribe((state: HandlingStartedEventProcessingState) => this.logStart(state));
    processing.process
      .pipe(filter((state) => state instanceof HandlingCompletedEventProcessingState))
      .subscribe((state: HandlingCompletedEventProcessingState) => this.logCompletion(state));
  }

  private logStart(state: HandlingStartedEventProcessingState) {
    this._logger.debug(` -- handling ${this.getEventName()} by ${state.provider.constructor.name}`);
  }

  private logCompletion(state: HandlingCompletedEventProcessingState) {
    const elapsedTime = ((Date.now() - this._processing.startedAt.getTime()) / 1000).toFixed(3);
    this._logger.debug(` -- ${this.getEventName()} handled by ${state.provider.constructor.name} in ${elapsedTime}s`);
  }

  private getEventName() {
    return `${this._processing.message.constructor.name} (id=${this._processing.id})`;
  }
}
