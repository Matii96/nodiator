import 'reflect-metadata';
import { of, Subject, toArray } from 'rxjs';
import { ProvidersManagerMock } from '../providers-manager/providers-manager.mocks';
import { ExecutorMock } from '../executor/executor.mocks';
import { MediatorLoggerMock } from '../logging/logging.mocks';
import { TestEvent, TestRequest } from '../messages/messages.mocks';
import { IMessageProcessingState } from '../executor/interfaces/message-processing-state.interface';
import { IExecutor } from '../executor/ports/executor.port';
import { IMediator } from './ports/mediator.port';
import { Mediator } from './mediator';

describe('Mediator', () => {
  let executor: IExecutor;
  let mediator: IMediator;

  beforeEach(() => {
    executor = new ExecutorMock();
    mediator = new Mediator(
      new MediatorLoggerMock(),
      new Subject<IMessageProcessingState>(),
      new ProvidersManagerMock(),
      executor
    );
  });

  it('should execute request', (done) => {
    jest.spyOn(executor, 'execute').mockImplementation((request: TestRequest) => of(request.property));
    mediator.request(new TestRequest('ok')).subscribe((response) => {
      expect(response).toBe('ok');
      done();
    });
  });

  it('should publish events', (done) => {
    const events = [new TestEvent(), new TestEvent()];
    jest.spyOn(executor, 'execute').mockImplementation((event: TestEvent) => of(event));
    mediator
      .publish(...events)
      .pipe(toArray())
      .subscribe((response) => {
        expect(response).toEqual(events);
        done();
      });
  });
});
