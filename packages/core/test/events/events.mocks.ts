import { EventHandler, GlobalEventHandler, IEventHandler, IGlobalEventHandler } from '../../lib';

export class TestEvent {}

@GlobalEventHandler()
export class TestGlobalEventHandler implements IGlobalEventHandler {
  static handle = jest.fn(async () => {});
  handle = TestGlobalEventHandler.handle;
}

@EventHandler(TestEvent)
export class TestEventHandler implements IEventHandler<TestEvent> {
  static handle = jest.fn(async (): Promise<any> => undefined);
  handle = TestEventHandler.handle;
}

@EventHandler(TestEvent)
export class TestLaggingEventHandler implements IEventHandler<TestEvent> {
  static handle = jest.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 10)));
  handle = TestLaggingEventHandler.handle;
}

@EventHandler(TestEvent)
export class TestFailingEventHandler implements IEventHandler<TestEvent> {
  static readonly exception = new Error('some exception');
  attempts = 0;

  handle = jest.fn(async () => {
    if (++this.attempts < 3) throw TestFailingEventHandler.exception;
  });
}
