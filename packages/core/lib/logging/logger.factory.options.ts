import { MediatorLoggingLevels } from '../config/mediator.config';
import { IMediatorLogger } from '../config/mediator.options';

export interface LoggerFactoryOptions {
  level?: MediatorLoggingLevels;
  logger?: IMediatorLogger;
}
