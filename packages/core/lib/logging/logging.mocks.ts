import { IMediatorLogger } from '../mediator.options';

export class MediatorLoggerMock implements IMediatorLogger {
  debug = jest.fn();
  info = jest.fn();
  warn = jest.fn();
  error = jest.fn();
}
