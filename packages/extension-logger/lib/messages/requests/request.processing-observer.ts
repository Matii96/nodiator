import { MessageProcessing, PipelineErrorRequestProcessingState } from '@nodiator/core';
import { ExceptionsLogger } from '../../exceptions-logger/exceptions.logger';
import { MediatorLogger } from '../../mediator-logger/mediator-logger';
import { ProcessingObserver } from '../shared/processing-observer.interface';

export class RequestProcessingObserver implements ProcessingObserver {
  private _processing: MessageProcessing;
  private _failed = false;

  constructor(private readonly _logger: MediatorLogger, private readonly _exceptionsLogger: ExceptionsLogger) {}

  init(processing: MessageProcessing) {
    this._processing = processing;
    this.logStarted();

    processing.process.subscribe({
      next: (state) => {
        if (state instanceof PipelineErrorRequestProcessingState) {
          this._failed = true;
          this.logError(state);
        }
      },
      complete: () => !this._failed && this.logCompletion(),
    });
  }

  private logStarted() {
    this._logger.debug(`Requested ${this.getRequestName()}`);
  }

  private logError(state: PipelineErrorRequestProcessingState) {
    const errorString = state.error.stack ?? state.error.message ?? state.error;
    this._exceptionsLogger.log(state.error, `${this.getRequestName()} failed. ${errorString}`);
  }

  private logCompletion() {
    const elapsedTime = ((Date.now() - this._processing.startedAt.getTime()) / 1000).toFixed(3);
    this._logger.debug(` -- ${this.getRequestName()} took ${elapsedTime}s`);
    this._logger.info(`${this.getRequestName()} handled`);
  }

  private getRequestName() {
    return `${this._processing.message.constructor.name} (id=${this._processing.id})`;
  }
}
