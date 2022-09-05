import 'reflect-metadata';
import { firstValueFrom, lastValueFrom, of, Subject } from 'rxjs';
import { ProviderMock, ProvidersManagerMock } from '../providers-manager/providers-manager.mocks';
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
    jest.spyOn(executor, 'execute').mockReturnValue(of(undefined));

    mediator = new Mediator(
      { providers: [ProviderMock] },
      new MediatorLoggerMock(),
      new Subject<IMessageProcessingState>(),
      new ProvidersManagerMock(),
      executor
    );
  });

  it('should execute request', async () => {
    expect(await firstValueFrom(mediator.request(new TestRequest('ok')))).toBeUndefined();
  });

  it('should publish event', async () => {
    expect(await lastValueFrom(mediator.publish(new TestEvent(), new TestEvent()))).toBeUndefined();
  });
});
