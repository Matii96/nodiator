import 'reflect-metadata';
import { of, Subject, toArray } from 'rxjs';
import { MessageTypes } from '../messages';
import { ProvidersManagerMock } from '../providers-manager/providers-manager.mocks';
import { ExtensionsManagerMock } from '../extensions/extensions-manager.mocks';
import { TestRequest } from '../messages/request/messages.mocks';
import { ExecutorMock } from '../executor/executor.mocks';
import { TestEvent } from '../messages/event/events.mocks';
import { Executor } from '../executor/ports/executor.port';
import { Mediator } from './ports/mediator.port';
import { MediatorImplementation } from './mediator';

describe('Mediator', () => {
  let executor: Executor;
  let mediator: Mediator;

  beforeEach(() => {
    executor = new ExecutorMock();
    mediator = new MediatorImplementation(
      new Subject(),
      new ProvidersManagerMock(),
      new ExtensionsManagerMock(),
      executor
    );
  });

  it('should execute request', (done) => {
    jest
      .spyOn(executor, 'execute')
      .mockImplementation((messageType: MessageTypes, request: TestRequest) => of(request.property));
    mediator.request(new TestRequest('ok')).subscribe((response) => {
      expect(response).toBe('ok');
      done();
    });
  });

  it('should publish events', (done) => {
    const events = [new TestEvent(), new TestEvent()];
    jest.spyOn(executor, 'execute').mockImplementation((messageType: MessageTypes, event: TestEvent) => of(event));
    mediator
      .publish(...events)
      .pipe(toArray())
      .subscribe((response) => {
        expect(response).toEqual(events);
        done();
      });
  });
});
