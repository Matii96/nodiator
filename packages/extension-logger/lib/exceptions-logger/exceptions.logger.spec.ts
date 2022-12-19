import { MediatorException } from '@nodiator/core';
import { MediatorLoggingLevels } from '../logging-level';
import { MediatorLogger } from '../mediator-logger/mediator-logger.port';
import { MediatorLoggerMock } from '../mediator-logger/mediator-logger.mocks';
import { MediatorExceptionsLogger } from './exceptions.logger';

class ErrorMock extends Error {}
class MediatorExceptionMock extends MediatorException {}

describe('ExceptionsLogger', () => {
  let mediatorLogger: MediatorLogger;

  beforeEach(() => {
    mediatorLogger = new MediatorLoggerMock();
  });

  describe('default behaviour', () => {
    it('should log standard error log - custom levels not defined', () => {
      const exceptionsLogger = new MediatorExceptionsLogger(mediatorLogger, {});
      exceptionsLogger.log(new ErrorMock(), 'error');
      expect(mediatorLogger.error).toBeCalledTimes(1);
    });

    it('should log standard error log - exception not found in custom levels', () => {
      const exceptionsLogger = new MediatorExceptionsLogger(mediatorLogger, {
        [MediatorLoggingLevels.WARN]: [MediatorExceptionMock],
      });
      exceptionsLogger.log(new ErrorMock(), 'error');
      expect(mediatorLogger.error).toBeCalledTimes(1);
    });
  });

  describe('custom behaviour', () => {
    it('should log only warn log', () => {
      const exceptionsLogger = new MediatorExceptionsLogger(mediatorLogger, {
        [MediatorLoggingLevels.WARN]: [Error],
      });
      exceptionsLogger.log(new ErrorMock(), 'error');
      expect(mediatorLogger.warn).toBeCalledTimes(1);
      expect(mediatorLogger.error).not.toHaveBeenCalled();
    });
  });
});
