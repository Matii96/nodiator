import { IMediatorLogger } from './mediator-logger.port';

export class MediatorLoggerMock implements IMediatorLogger {
  readonly timeline: string[] = [];

  debug = jest.fn((msg) => this.timeline.push(msg));
  info = jest.fn((msg) => this.timeline.push(msg));
  warn = jest.fn((msg) => this.timeline.push(msg));
  error = jest.fn((msg) => this.timeline.push(msg));
}
