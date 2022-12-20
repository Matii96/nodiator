import { ExceptionsLogger } from './exceptions.logger';

export class ExceptionsLoggerMock implements ExceptionsLogger {
  log = jest.fn();
}
