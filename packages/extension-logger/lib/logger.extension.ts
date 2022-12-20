import { Mediator, MediatorExtension } from '@nodiator/core';
import { LoggerExtensionOptions } from './options/logger.extension.options';
import { LoggerExtensionDynamicOptions } from './options/logger.extension.dynamic-options';
import { MediatorLogger } from './mediator-logger/mediator-logger';
import { ExceptionsLogger } from './exceptions-logger/exceptions.logger';
import { MediatorExceptionsLogger } from './exceptions-logger/exceptions.logger.impl';
import { LoggingLevelProxy } from './logging-level/logging-level.proxy';
import { DefaultMediatorLogger } from './mediator-logger/default-logger/default.mediator-logger';
import { PROCESSING_OBSERVERS } from './messages/processing-observers.map';

export class LoggerExtension implements MediatorExtension {
  private readonly _dynamicOptions: () => LoggerExtensionDynamicOptions;
  private readonly _logger: MediatorLogger;
  private readonly _exceptionsLogger: ExceptionsLogger;

  constructor(options: LoggerExtensionOptions = {}) {
    this._dynamicOptions = options.dynamicOptions ?? (() => ({}));
    this._logger = new LoggingLevelProxy(options.logger ?? new DefaultMediatorLogger(), this._dynamicOptions);
    this._exceptionsLogger = new MediatorExceptionsLogger(this._logger, options.exceptionsLoggingLevels);
  }

  init(mediator: Mediator) {
    mediator.bus.subscribe((processing) =>
      PROCESSING_OBSERVERS[processing.messageType].forEach((observer) =>
        new observer(this._logger, this._exceptionsLogger).init(processing)
      )
    );
  }
}
