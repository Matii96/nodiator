import { IMessageProcessing, PipelineErrorRequestProcessingState } from '@nodiator/core';
import { IExceptionsLogger } from '../../exceptions-logger/exceptions.logger.port';
import { IMediatorLogger } from '../../mediator-logger/mediator-logger.port';
import { IProcessingObserver } from '../shared/processing-observer.interface';

export class RequestProcessingObserver implements IProcessingObserver {
  private _processing: IMessageProcessing;
  private _failed = false;

  constructor(private readonly _logger: IMediatorLogger, private readonly _exceptionsLogger: IExceptionsLogger) {}

  init(processing: IMessageProcessing) {
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
