import { HandlingErrorEventProcessingState, IMessageProcessing } from '@nodiator/core';
import { IExceptionsLogger } from '../../exceptions-logger/exceptions.logger.port';
import { IMediatorLogger } from '../../mediator-logger/mediator-logger.port';
import { IProcessingObserver } from '../shared/processing-observer.interface';

export class EventProcessingObserver implements IProcessingObserver {
  private _processing: IMessageProcessing;
  private _failed = false;

  constructor(private readonly _logger: IMediatorLogger, private readonly _exceptionsLogger: IExceptionsLogger) {}

  init(processing: IMessageProcessing) {
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
