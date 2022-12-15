import { IEventHandler } from './interfaces';

export class TestEvent {}

export class TestEventHandler implements IEventHandler<TestEvent> {
  handle = jest.fn(async (): Promise<any> => undefined);
}
