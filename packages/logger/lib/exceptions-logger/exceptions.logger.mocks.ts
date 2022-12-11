import { IExceptionsLogger } from './exceptions.logger.port';

export class ExceptionsLoggerMock implements IExceptionsLogger {
  log = jest.fn();
}
