import { MediatorLogger } from './mediator-logger.port';

export class MediatorLoggerMock implements MediatorLogger {
  readonly timeline: string[] = [];

  debug = jest.fn((msg) => this.timeline.push(msg));
  info = jest.fn((msg) => this.timeline.push(msg));
  warn = jest.fn((msg) => this.timeline.push(msg));
  error = jest.fn((msg) => this.timeline.push(msg));
}
