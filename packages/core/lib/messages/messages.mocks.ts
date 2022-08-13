import { IEventHandler } from './event';
import { IRequestHandler } from './request';

export class TestRequest {
  constructor(readonly property = '') {}
}

export class TestEvent {}

export class TestRequestHandler implements IRequestHandler<TestRequest, void> {
  handle = jest.fn(async () => undefined);
}

export class TestEventHandler implements IEventHandler<TestRequest> {
  handle = jest.fn(async () => undefined);
}
