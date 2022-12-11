import { from, of, throwError } from 'rxjs';
import { EventHandler, GlobalEventHandler, IEventHandler, IGlobalEventHandler } from '@nodiator/core';

export class TestEvent {}

@GlobalEventHandler()
export class TestGlobalEventHandler implements IGlobalEventHandler {
  handle = jest.fn(() => of(undefined));
}

@EventHandler(TestEvent)
export class TestEventHandler implements IEventHandler<TestEvent> {
  handle = jest.fn(() => of(undefined));
}

@EventHandler(TestEvent)
export class FailingTestEventHandler implements IEventHandler<TestEvent> {
  handle = jest.fn(() => from(throwError(() => new Error())));
}
