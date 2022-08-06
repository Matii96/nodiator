import { IMediatorLogger, MediatorLoggingLevels } from '../mediator/mediator.options';

export interface LoggerFactoryOptions {
  loggingLevel?: MediatorLoggingLevels;
  logger?: IMediatorLogger;
}
