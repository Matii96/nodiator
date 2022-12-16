import { ExceptionsLogger } from './exceptions.logger.port';

export class ExceptionsLoggerMock implements ExceptionsLogger {
  log = jest.fn();
}
