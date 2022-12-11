import { IMediator, IMediatorExtension } from '@nodiator/core';
import { LoggerExtensionOptions } from './options/logger.extension.options';
import { LoggerExtensionDynamicOptions } from './options/logger.extension.dynamic-options';
import { IMediatorLogger } from './mediator-logger/mediator-logger.port';
import { IExceptionsLogger } from './exceptions-logger/exceptions.logger.port';
import { LoggingLevelProxy } from './logging-level/logging-level.proxy';
import { DefaultMediatorLogger } from './mediator-logger/default-logger/default.mediator-logger';
import { PROCESSING_OBSERVERS } from './messages/processing-observers.map';
import { ExceptionsLogger } from './exceptions-logger/exceptions.logger';

export class LoggerExtension implements IMediatorExtension {
  private readonly _dynamicOptions: () => LoggerExtensionDynamicOptions;
  private readonly _logger: IMediatorLogger;
  private readonly _exceptionsLogger: IExceptionsLogger;

  constructor(options: LoggerExtensionOptions = {}) {
    this._dynamicOptions = options.dynamicOptions ?? (() => ({}));
    this._logger = new LoggingLevelProxy(options.logger ?? new DefaultMediatorLogger(), this._dynamicOptions);
    this._exceptionsLogger = new ExceptionsLogger(this._logger, options.exceptionsLoggingLevels);
  }

  init(mediator: IMediator) {
    mediator.bus.subscribe((processing) =>
      PROCESSING_OBSERVERS[processing.messageType].forEach((observer) =>
        new observer(this._logger, this._exceptionsLogger).init(processing)
      )
    );
  }
}
