import { HandlingErrorEventProcessingState, MessageProcessing } from '@nodiator/core';
import { ExceptionsLogger } from '../../exceptions-logger/exceptions.logger';
import { MediatorLogger } from '../../mediator-logger/mediator-logger';
import { ProcessingObserver } from '../shared/processing-observer.interface';

export class EventProcessingObserver implements ProcessingObserver {
  private _processing: MessageProcessing;
  private _failed = false;

  constructor(private readonly _logger: MediatorLogger, private readonly _exceptionsLogger: ExceptionsLogger) {}

  init(processing: MessageProcessing) {
    this._processing = processing;
    this.logStarted();

    processing.process.subscribe({
      next: (state) => {
        if (state instanceof HandlingErrorEventProcessingState) {
          this._failed = true;
          this.logError(state);
        }
      },
      complete: () => !this._failed && this.logCompletion(),
    });
  }

  private logStarted() {
    this._logger.debug(`Emmited ${this.getEventName()}`);
  }

  private logError(state: HandlingErrorEventProcessingState) {
    const errorString = state.error.stack ?? state.error.message ?? state.error;
    this._exceptionsLogger.log(state.error, `${this.getEventName()} failed. ${errorString}`);
  }

  private logCompletion() {
    this._logger.info(`${this.getEventName()} handled`);
  }

  private getEventName() {
    return `${this._processing.message.constructor.name} (id=${this._processing.id})`;
  }
}
