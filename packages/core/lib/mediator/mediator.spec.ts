import 'reflect-metadata';
import { Subject } from 'rxjs';
import { ProviderMock, ProvidersManagerMock } from '../providers-manager/providers-manager.mocks';
import { ExecutorMock } from '../executor/executor.mocks';
import { MediatorLoggerMock } from '../logging/logging.mocks';
import { TestEvent, TestRequest } from '../messages/messages.mocks';
import { IMessageProcessingState } from '../executor';
import { IMediator } from './ports/mediator.port';
import { Mediator } from './mediator';

describe('Mediator', () => {
  let mediator: IMediator;

  beforeEach(() => {
    mediator = new Mediator(
      { providers: [ProviderMock] },
      new MediatorLoggerMock(),
      new Subject<IMessageProcessingState>(),
      new ProvidersManagerMock(),
      new ExecutorMock()
    );
  });

  it('should execute request', async () => {
    expect(await mediator.request(new TestRequest('ok'))).toBeUndefined();
  });

  it('should publish event', async () => {
    expect(await mediator.publish(new TestEvent(), new TestEvent())).toBeUndefined();
  });
});
