import { EventHandler, GlobalEventHandler, IEvent, IEventHandler } from '../../lib';

export class TestEvent {}

@GlobalEventHandler()
export class TestGlobalEventHandler implements IEventHandler<IEvent> {
  static handle = jest.fn(async () => null);
  handle = TestGlobalEventHandler.handle;
}

@EventHandler(TestEvent)
export class TestEventHandler implements IEventHandler<TestEvent> {
  static handle = jest.fn(async () => null);
  handle = TestEventHandler.handle;
}

@EventHandler(TestEvent)
export class TestLaggingEventHandler implements IEventHandler<TestEvent> {
  static handle = jest.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 5)));
  handle = TestLaggingEventHandler.handle;
}

@EventHandler(TestEvent)
export class TestFailingEventHandler implements IEventHandler<TestEvent> {
  private attempts: number = 0;

  handle = jest.fn(async (event: TestEvent) => {
    if (++this.attempts < 3) throw new Error('some exception');
  });
}
