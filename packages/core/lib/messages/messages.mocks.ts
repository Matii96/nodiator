import { IEventHandler } from './event';
import { IRequestHandler, IRequestPipeline } from './request';

// Requests
export class TestRequest {
  constructor(readonly property = '') {}
}

export class TestRequestPipeline implements IRequestPipeline<TestRequest, any> {
  handle = jest.fn((request: TestRequest, next: () => Promise<any>) => next());
}

export class TestRequestHandler implements IRequestHandler<TestRequest, any> {
  handle = jest.fn(async () => undefined);
}

// Events
export class TestEvent {}

export class TestEventHandler implements IEventHandler<TestRequest> {
  handle = jest.fn(async () => undefined);
}
