import {
  MessageProcessing,
  HandlingCompletedRequestProcessingState,
  HandlingStartedRequestProcessingState,
} from '@nodiator/core';
import { filter } from 'rxjs';
import { MediatorLogger } from '../../mediator-logger/mediator-logger';
import { ProcessingObserver } from '../shared/processing-observer.interface';

export class RequestProvidersProcessingObserver implements ProcessingObserver {
  private _processing: MessageProcessing;

  constructor(private readonly _logger: MediatorLogger) {}

  init(processing: MessageProcessing) {
    this._processing = processing;
    processing.process
      .pipe(filter((state) => state instanceof HandlingStartedRequestProcessingState))
      .subscribe((state: HandlingStartedRequestProcessingState) => this.logStart(state));
    processing.process
      .pipe(filter((state) => state instanceof HandlingCompletedRequestProcessingState))
      .subscribe((state: HandlingCompletedRequestProcessingState) => this.logCompletion(state));
  }

  private logStart(state: HandlingStartedRequestProcessingState) {
    this._logger.debug(` -- handling ${this.getRequestName()} by ${state.provider.constructor.name}`);
  }

  private logCompletion(state: HandlingCompletedRequestProcessingState) {
    this._logger.debug(` -- ${state.provider.constructor.name} responded to ${this.getRequestName()}`);
  }

  private getRequestName() {
    return `${this._processing.message.constructor.name} (id=${this._processing.id})`;
  }
}
