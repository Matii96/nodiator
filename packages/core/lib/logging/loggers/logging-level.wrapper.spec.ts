import { IMediatorLogger } from '../../mediator/mediator.options';
import { MediatorLoggerMock } from '../logging.mocks';
import { LoggingLevelWrapper } from './logging-level.wrapper';

const logAll = (logger: IMediatorLogger) => {
  const msg = 'some message';
  logger.debug(msg);
  logger.info(msg);
  logger.warn(msg);
  logger.error(msg);
};

describe('LoggingLevelWrapper', () => {
  let baseLogger: IMediatorLogger;
  let logger: IMediatorLogger;

  beforeEach(() => {
    baseLogger = new MediatorLoggerMock();
  });

  it('should log all levels', () => {
    logger = new LoggingLevelWrapper(baseLogger, 'debug');
    logAll(logger);

    expect(baseLogger.debug).toHaveBeenCalledTimes(1);
    expect(baseLogger.info).toHaveBeenCalledTimes(1);
    expect(baseLogger.warn).toHaveBeenCalledTimes(1);
    expect(baseLogger.error).toHaveBeenCalledTimes(1);
  });

  it('should log all levels except of debug', () => {
    logger = new LoggingLevelWrapper(baseLogger, 'info');
    logAll(logger);

    expect(baseLogger.debug).toHaveBeenCalledTimes(0);
    expect(baseLogger.info).toHaveBeenCalledTimes(1);
    expect(baseLogger.warn).toHaveBeenCalledTimes(1);
    expect(baseLogger.error).toHaveBeenCalledTimes(1);
  });

  it('should log all levels except of debug and info', () => {
    logger = new LoggingLevelWrapper(baseLogger, 'warn');
    logAll(logger);

    expect(baseLogger.debug).toHaveBeenCalledTimes(0);
    expect(baseLogger.info).toHaveBeenCalledTimes(0);
    expect(baseLogger.warn).toHaveBeenCalledTimes(1);
    expect(baseLogger.error).toHaveBeenCalledTimes(1);
  });

  it('should log only error level', () => {
    logger = new LoggingLevelWrapper(baseLogger, 'error');
    logAll(logger);

    expect(baseLogger.debug).toHaveBeenCalledTimes(0);
    expect(baseLogger.info).toHaveBeenCalledTimes(0);
    expect(baseLogger.warn).toHaveBeenCalledTimes(0);
    expect(baseLogger.error).toHaveBeenCalledTimes(1);
  });
});