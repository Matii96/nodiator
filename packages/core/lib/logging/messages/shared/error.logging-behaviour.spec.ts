import { IMediatorLogger, MediatorLoggingLevels } from '../../../config';
import { MediatorException } from '../../../exceptions';
import { MediatorLoggerMock } from '../../logging.mocks';
import { ILoggingBehaviour } from '../../ports/logging-behaviour.port';
import { SharedErrorLoggingBehaviour } from './error.logging-behaviour';

class ErrorMock extends Error {}
class MediatorExceptionMock extends MediatorException {}

class ErrorLoggingBehaviourMock extends SharedErrorLoggingBehaviour implements ILoggingBehaviour {
  logError(error: Error, msg: string) {
    return this.log(error, msg);
  }
}

describe('SharedErrorLoggingBehaviour', () => {
  let logger: IMediatorLogger;
  let behaviour: ErrorLoggingBehaviourMock;

  beforeEach(() => {
    logger = new MediatorLoggerMock();
  });

  describe('default behaviour', () => {
    it('should log standard error log - custom levels not defined', () => {
      behaviour = new ErrorLoggingBehaviourMock(logger, {});
      behaviour.logError(new ErrorMock(), 'error');
      expect(logger.error).toBeCalledTimes(1);
    });

    it('should log standard error log - exception not found in custom levels', () => {
      behaviour = new ErrorLoggingBehaviourMock(logger, {
        exceptionsLoggingLevels: { [MediatorLoggingLevels.WARN]: [MediatorExceptionMock] },
      });
      behaviour.logError(new ErrorMock(), 'error');
      expect(logger.error).toBeCalledTimes(1);
    });
  });

  describe('custom behaviour', () => {
    beforeEach(() => {
      behaviour = new ErrorLoggingBehaviourMock(logger, {
        exceptionsLoggingLevels: { [MediatorLoggingLevels.WARN]: [Error] },
      });
    });

    it('should log only warn log', () => {
      behaviour.logError(new ErrorMock(), 'error');
      expect(logger.warn).toBeCalledTimes(1);
      expect(logger.error).not.toHaveBeenCalled();
    });
  });
});
