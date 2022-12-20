import { MediatorLoggerMock } from '../mediator-logger/mediator-logger.mocks';
import { MediatorLogger } from '../mediator-logger/mediator-logger';
import { LoggingLevelProxy } from './logging-level.proxy';
import { MediatorLoggingLevels } from './logging-levels.enum';

const logAll = (logger: MediatorLogger) => {
  const msg = 'some message';
  logger.debug(msg);
  logger.info(msg);
  logger.warn(msg);
  logger.error(msg);
};

describe('proxy', () => {
  let baseLogger: MediatorLogger;
  let logger: MediatorLogger;

  beforeEach(() => {
    baseLogger = new MediatorLoggerMock();
  });

  it('should log all levels', () => {
    logger = new LoggingLevelProxy(baseLogger, () => ({ level: MediatorLoggingLevels.DEBUG }));
    logAll(logger);

    expect(baseLogger.debug).toHaveBeenCalledTimes(1);
    expect(baseLogger.info).toHaveBeenCalledTimes(1);
    expect(baseLogger.warn).toHaveBeenCalledTimes(1);
    expect(baseLogger.error).toHaveBeenCalledTimes(1);
  });

  it('should log all levels except of debug', () => {
    logger = new LoggingLevelProxy(baseLogger, () => ({ level: MediatorLoggingLevels.INFO }));
    logAll(logger);

    expect(baseLogger.debug).not.toHaveBeenCalled();
    expect(baseLogger.info).toHaveBeenCalledTimes(1);
    expect(baseLogger.warn).toHaveBeenCalledTimes(1);
    expect(baseLogger.error).toHaveBeenCalledTimes(1);
  });

  it('should log all levels except of debug and info', () => {
    logger = new LoggingLevelProxy(baseLogger, () => ({ level: MediatorLoggingLevels.WARN }));
    logAll(logger);

    expect(baseLogger.debug).not.toHaveBeenCalled();
    expect(baseLogger.info).not.toHaveBeenCalled();
    expect(baseLogger.warn).toHaveBeenCalledTimes(1);
    expect(baseLogger.error).toHaveBeenCalledTimes(1);
  });

  it('should log only error level', () => {
    logger = new LoggingLevelProxy(baseLogger, () => ({ level: MediatorLoggingLevels.ERROR }));
    logAll(logger);

    expect(baseLogger.debug).not.toHaveBeenCalled();
    expect(baseLogger.info).not.toHaveBeenCalled();
    expect(baseLogger.warn).not.toHaveBeenCalled();
    expect(baseLogger.error).toHaveBeenCalledTimes(1);
  });
});
